"use client";

import AdminLayout from "@/app/components/layout/AdminLayout";
import Button from "@/app/components/ui/Button";
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
            <div className="flex items-center justify-center min-h-screen bg-white border-0">
                <h1 className="text-2xl font-bold">Loading...</h1>
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
            <div className="pt-30">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-normal">Coupons</h1>
                    <Button onClick={() => { setEditCoupon(null); setIsOpen(true); }}>New Coupon</Button>
                </div>

                <div className="border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-normal">All Coupons</h2>
                    </div>
                    <div className="p-6">
                        {couponsLoading ? (
                            <div className="text-center text-gray-500">Loading coupons...</div>
                        ) : coupons.length === 0 ? (
                            <div className="text-center text-gray-500">No coupons found.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left px-4 py-2 font-medium">Code</th>
                                            <th className="text-left px-4 py-2 font-medium">Type</th>
                                            <th className="text-left px-4 py-2 font-medium">Value</th>
                                            <th className="text-left px-4 py-2 font-medium">Min Order</th>
                                            <th className="text-left px-4 py-2 font-medium">Active</th>
                                            <th className="text-left px-4 py-2 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {coupons.map((c) => (
                                            <tr key={c.id} className="border-b border-gray-200">
                                                <td className="px-4 py-2">{c.code}</td>
                                                <td className="px-4 py-2">{c.type}</td>
                                                <td className="px-4 py-2">{c.type === 'PERCENTAGE' ? `${c.value}%` : `₹${c.value}`}</td>
                                                <td className="px-4 py-2">₹{c.minOrderValue}</td>
                                                <td className="px-4 py-2">{c.isActive ? 'Yes' : 'No'}</td>
                                                <td className="px-4 py-2">
                                                    <div className="flex gap-2">
                                                        <Button size="sm" variant="outline" onClick={() => { setEditCoupon(c); setIsOpen(true); }}>Edit</Button>
                                                        <Button size="sm" variant="outline" onClick={() => deleteCoupon.mutate(c.id)} disabled={deleteCoupon.isPending}>Delete</Button>
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
                    <div className="p-6 max-w-2xl w-full">
                        <h2 className="text-xl font-bold mb-4">{editCoupon ? 'Edit Coupon' : 'Create Coupon'}</h2>
                        <form className="grid grid-cols-2 gap-4" onSubmit={onSubmit}>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input name="name" defaultValue={editCoupon?.name || ''} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Code</label>
                                <input name="code" defaultValue={editCoupon?.code || ''} required className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Type</label>
                                <select name="type" defaultValue={editCoupon?.type || 'PERCENTAGE'} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black">
                                    <option value="PERCENTAGE">Percentage</option>
                                    <option value="FIXED">Fixed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Value</label>
                                <input name="value" type="number" step="0.01" min="0" required defaultValue={editCoupon?.value ?? 0} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Max Discount</label>
                                <input name="maxDiscount" type="number" step="0.01" min="0" defaultValue={editCoupon?.maxDiscount ?? ''} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Min Order Value</label>
                                <input name="minOrderValue" type="number" step="0.01" min="0" required defaultValue={editCoupon?.minOrderValue ?? 0} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Valid From</label>
                                <input name="validFrom" type="date" defaultValue={editCoupon?.validFrom?.slice(0, 10) ?? ''} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Valid Until</label>
                                <input name="validUntil" type="date" defaultValue={editCoupon?.validUntil?.slice(0, 10) ?? ''} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Usage Limit</label>
                                <input name="usageLimit" type="number" min="0" defaultValue={editCoupon?.usageLimit ?? ''} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">User Usage Limit</label>
                                <input name="userUsageLimit" type="number" min="0" defaultValue={editCoupon?.userUsageLimit ?? ''} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea name="description" rows={3} defaultValue={editCoupon?.description ?? ''} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black" />
                            </div>
                            <div className="col-span-2 flex items-center gap-2">
                                <input id="isActive" name="isActive" type="checkbox" defaultChecked={!!editCoupon?.isActive} />
                                <label htmlFor="isActive" className="text-sm">Active</label>
                            </div>
                            <div className="col-span-2 flex gap-2 mt-2">
                                <Button type="submit" disabled={createCoupon.isPending || updateCoupon.isPending}>
                                    {createCoupon.isPending || updateCoupon.isPending ? 'Saving...' : (editCoupon ? 'Update' : 'Create')}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => { setIsOpen(false); setEditCoupon(null); }}>Cancel</Button>
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>
        </AdminLayout>
    );
}


