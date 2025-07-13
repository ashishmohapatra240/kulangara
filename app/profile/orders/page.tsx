"use client";

import ProfileLayout from "@/app/components/layout/ProfileLayout";
import { OrdersSection } from "@/app/components/ui/profile/OrdersSection";

export default function OrdersPage() {
  return (
    <ProfileLayout>
      <OrdersSection />
    </ProfileLayout>
  );
} 