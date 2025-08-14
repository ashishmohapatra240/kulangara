import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import couponService from '../services/coupon.service';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import { ICouponFilters, ICreateCouponData, IUpdateCouponData } from '../types/coupon.type';
import { getErrorMessage } from '../lib/utils';

export function useAdminCoupons(filters?: ICouponFilters) {
  return useQuery({
    queryKey: ['admin-coupons', filters],
    queryFn: () => couponService.getCoupons(filters),
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateCouponData) => couponService.createCoupon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      queryClient.refetchQueries({ queryKey: ['admin-coupons'] });
      toast.success('Coupon created');
    },
    onError: (error: AxiosError) => toast.error(getErrorMessage(error)),
  });
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateCouponData }) => couponService.updateCoupon(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      queryClient.refetchQueries({ queryKey: ['admin-coupons'] });
      toast.success('Coupon updated');
    },
    onError: (error: AxiosError) => toast.error(getErrorMessage(error)),
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => couponService.deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      queryClient.refetchQueries({ queryKey: ['admin-coupons'] });
      toast.success('Coupon deleted');
    },
    onError: (error: AxiosError) => toast.error(getErrorMessage(error)),
  });
}