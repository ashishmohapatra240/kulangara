"use client";

import AdminLayout from "@/app/components/layout/AdminLayout";
import { Button } from "@/app/components/ui/button";
import Modal from "@/app/components/ui/Modal";
import { useAuth } from "@/app/hooks/useAuth";
import { useCreateCoupon, useAdminCoupons, useDeleteCoupon, useUpdateCoupon } from "@/app/hooks/useAdminCoupons";
import { ICreateCouponData, ICoupon } from "@/app/types/coupon.type";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN"];

export default function AdminCouponsPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const { data: couponsResponse, isLoading: couponsLoading } = useAdminCoupons();
    const createCoupon = useCreateCoupon();
    const updateCoupon = useUpdateCoupon();
    const deleteCoupon = useDeleteCoupon();

    const [isOpen, setIsOpen] = useState(false);
    const [editCoupon, setEditCoupon] = useState<ICoupon | null>(null);

    const coupons = useMemo(() => couponsResponse?.data ?? [], [couponsResponse]);

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.replace("/(auth)/login?redirect=/admin/coupons");
            } else if (!user || !ALLOWED_ROLES.includes(user.role)) {
                router.replace("/");
            }
        }
    }, [isLoading, isAuthenticated, user, router]);

    useEffect(() => {
        if (createCoupon.isSuccess || updateCoupon.isSuccess) {
            setIsOpen(false);
            setEditCoupon(null);
        }
    }, [createCoupon.isSuccess, updateCoupon.isSuccess]);

    if (isLoading || !isAuthenticated || !user || !ALLOWED_ROLES.includes(user.role)) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <p className="text-base font-medium text-muted-foreground">Loading...</p>
            </div>
        );
    }

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement & {
            name: { value: string };
            code: { value: string };
            type: { value: "PERCENTAGE" | "FIXED" };
            value: { value: string };
            maxDiscount: { value: string };
            minOrderValue: { value: string };
            validFrom: { value: string };
            validUntil: { value: string };
            usageLimit: { value: string };
            userUsageLimit: { value: string };
            description: { value: string };
            isActive: { checked: boolean };
        };

        const validFromISO = form.validFrom.value ? new Date(form.validFrom.value).toISOString() : undefined;
        const validUntilISO = form.validUntil.value ? new Date(form.validUntil.value).toISOString() : undefined;

        const payload: ICreateCouponData = {
            name: form.name.value,
            code: form.code.value,
            type: form.type.value,
            value: Number(form.value.value),
            maxDiscount: form.maxDiscount.value ? Number(form.maxDiscount.value) : undefined,
            minOrderValue: Number(form.minOrderValue.value),
            validFrom: validFromISO,
            validUntil: validUntilISO,
            usageLimit: form.usageLimit.value ? Number(form.usageLimit.value) : undefined,
            userUsageLimit: form.userUsageLimit.value ? Number(form.userUsageLimit.value) : undefined,
            description: form.description.value || undefined,
            isActive: form.isActive.checked,
        };

        if (editCoupon) {
            updateCoupon.mutate({ id: editCoupon.id, data: { ...payload, id: editCoupon.id } });
        } else {
            createCoupon.mutate(payload);
        }
    }

    return (
        <AdminLayout>
            <div className="min-h-screen bg-white">
                <div className="flex justify-between items-center pt-30 mb-12 pb-6 border-b-2 border-black">
                    <h1 className="text-4xl font-bold tracking-tight">COUPONS</h1>
                    <Button onClick={() => { setEditCoupon(null); setIsOpen(true); }}>NEW COUPON</Button>
                </div>

                <div className="border-2 border-black">
                    <div className="p-8 border-b-2 border-black bg-white">
                        <h2 className="text-2xl font-bold text-black tracking-tight">ALL COUPONS</h2>
                    </div>
                    <div className="p-8">
                        {couponsLoading ? (
                            <div className="text-center text-black font-bold tracking-wide py-12">LOADING COUPONS...</div>
                        ) : coupons.length === 0 ? (
                            <div className="text-center text-gray-600 font-medium tracking-wide py-12">NO COUPONS FOUND.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="bg-black text-white">
                                            <th className="text-left px-8 py-4 font-bold tracking-widest border-r border-gray-700">CODE</th>
                                            <th className="text-left px-8 py-4 font-bold tracking-widest border-r border-gray-700">TYPE</th>
                                            <th className="text-left px-8 py-4 font-bold tracking-widest border-r border-gray-700">VALUE</th>
                                            <th className="text-left px-8 py-4 font-bold tracking-widest border-r border-gray-700">MIN ORDER</th>
                                            <th className="text-left px-8 py-4 font-bold tracking-widest border-r border-gray-700">ACTIVE</th>
                                            <th className="text-left px-8 py-4 font-bold tracking-widest">ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {coupons.map((c, index) => (
                                            <tr key={c.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                <td className="px-8 py-6 font-bold text-black border-r border-gray-200">{c.code}</td>
                                                <td className="px-8 py-6 font-medium text-black border-r border-gray-200">{c.type}</td>
                                                <td className="px-8 py-6 font-bold text-black border-r border-gray-200">{c.type === 'PERCENTAGE' ? `${c.value}%` : `₹${c.value}`}</td>
                                                <td className="px-8 py-6 font-medium text-black border-r border-gray-200">₹{c.minOrderValue}</td>
                                                <td className="px-8 py-6 border-r border-gray-200">
                                                    <span className={`px-3 py-1 text-xs font-bold tracking-widest ${c.isActive ? 'bg-black text-white' : 'bg-white text-black border border-black'}`}>
                                                        {c.isActive ? 'YES' : 'NO'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex gap-3">
                                                        <Button size="sm" variant="outline" onClick={() => { setEditCoupon(c); setIsOpen(true); }}>EDIT</Button>
                                                        <Button size="sm" variant="outline" onClick={() => deleteCoupon.mutate(c.id)} disabled={deleteCoupon.isPending}>DELETE</Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                <Modal isOpen={isOpen} onClose={() => { setIsOpen(false); setEditCoupon(null); }}>
                    <div className="p-8 max-w-2xl w-full border-2 border-black">
                        <h2 className="text-2xl font-bold mb-8 tracking-tight">{editCoupon ? 'EDIT COUPON' : 'CREATE COUPON'}</h2>
                        <form className="grid grid-cols-2 gap-4" onSubmit={onSubmit}>
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-black mb-2 tracking-widest">NAME</label>
                                <input name="name" defaultValue={editCoupon?.name || ''} className="w-full px-4 py-3 border-2 border-black focus:outline-none font-medium" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-black mb-2 tracking-widest">CODE</label>
                                <input name="code" defaultValue={editCoupon?.code || ''} required className="w-full px-4 py-3 border-2 border-black focus:outline-none font-medium" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-black mb-2 tracking-widest">TYPE</label>
                                <select name="type" defaultValue={editCoupon?.type || 'PERCENTAGE'} className="w-full px-4 py-3 border-2 border-black focus:outline-none font-medium">
                                    <option value="PERCENTAGE">PERCENTAGE</option>
                                    <option value="FIXED">FIXED</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-black mb-2 tracking-widest">VALUE</label>
                                <input name="value" type="number" step="0.01" min="0" required defaultValue={editCoupon?.value ?? 0} className="w-full px-4 py-3 border-2 border-black focus:outline-none font-medium" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-black mb-2 tracking-widest">MAX DISCOUNT</label>
                                <input name="maxDiscount" type="number" step="0.01" min="0" defaultValue={editCoupon?.maxDiscount ?? ''} className="w-full px-4 py-3 border-2 border-black focus:outline-none font-medium" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-black mb-2 tracking-widest">MIN ORDER VALUE</label>
                                <input name="minOrderValue" type="number" step="0.01" min="0" required defaultValue={editCoupon?.minOrderValue ?? 0} className="w-full px-4 py-3 border-2 border-black focus:outline-none font-medium" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-black mb-2 tracking-widest">VALID FROM</label>
                                <input name="validFrom" type="date" defaultValue={editCoupon?.validFrom?.slice(0, 10) ?? ''} className="w-full px-4 py-3 border-2 border-black focus:outline-none font-medium" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-black mb-2 tracking-widest">VALID UNTIL</label>
                                <input name="validUntil" type="date" defaultValue={editCoupon?.validUntil?.slice(0, 10) ?? ''} className="w-full px-4 py-3 border-2 border-black focus:outline-none font-medium" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-black mb-2 tracking-widest">USAGE LIMIT</label>
                                <input name="usageLimit" type="number" min="0" defaultValue={editCoupon?.usageLimit ?? ''} className="w-full px-4 py-3 border-2 border-black focus:outline-none font-medium" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-black mb-2 tracking-widest">USER USAGE LIMIT</label>
                                <input name="userUsageLimit" type="number" min="0" defaultValue={editCoupon?.userUsageLimit ?? ''} className="w-full px-4 py-3 border-2 border-black focus:outline-none font-medium" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-black mb-2 tracking-widest">DESCRIPTION</label>
                                <textarea name="description" rows={3} defaultValue={editCoupon?.description ?? ''} className="w-full px-4 py-3 border-2 border-black focus:outline-none font-medium" />
                            </div>
                            <div className="col-span-2 flex items-center gap-3">
                                <input id="isActive" name="isActive" type="checkbox" defaultChecked={!!editCoupon?.isActive} className="w-5 h-5 border-2 border-black" />
                                <label htmlFor="isActive" className="text-sm font-bold tracking-widest">ACTIVE</label>
                            </div>
                            <div className="col-span-2 flex gap-4 mt-6">
                                <Button type="submit" disabled={createCoupon.isPending || updateCoupon.isPending}>
                                    {createCoupon.isPending || updateCoupon.isPending ? 'SAVING...' : (editCoupon ? 'UPDATE' : 'CREATE')}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => { setIsOpen(false); setEditCoupon(null); }}>CANCEL</Button>
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>
        </AdminLayout>
    );
}


