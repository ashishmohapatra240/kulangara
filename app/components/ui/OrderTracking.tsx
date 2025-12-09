"use client";

import { ITrackingHistoryItem } from "@/app/types/order.type";
import { CheckCircle2, Circle, Package, Truck, Home } from "lucide-react";

interface OrderTrackingProps {
  tracking: ITrackingHistoryItem[];
  currentStatus?: string;
}

const STATUS_ORDER: string[] = [
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
  'RETURNED',
  'REFUNDED'
];

const STATUS_LABELS: Record<string, string> = {
  'CONFIRMED': 'Order Confirmed',
  'PROCESSING': 'Processing',
  'SHIPPED': 'Shipped',
  'OUT_FOR_DELIVERY': 'Out for Delivery',
  'DELIVERED': 'Delivered',
};

const getStatusIcon = (status: string, size: string = "w-5 h-5") => {
  switch (status) {
    case 'CONFIRMED':
      return <CheckCircle2 className={size} />;
    case 'PROCESSING':
      return <Package className={size} />;
    case 'SHIPPED':
    case 'OUT_FOR_DELIVERY':
      return <Truck className={size} />;
    case 'DELIVERED':
      return <Home className={size} />;
    default:
      return <Circle className={size} />;
  }
};

export const OrderTrackingComponent = ({ tracking, currentStatus }: OrderTrackingProps) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  // Build a timeline based on enum order; enrich with timestamps if available in history
  const timeline = STATUS_ORDER
    .filter((s) => s !== 'CANCELLED' && s !== 'RETURNED' && s !== 'REFUNDED')
    .map((status) => {
      const match = tracking.find((t) => t.status === status);
      const reached = !!match || (currentStatus ? STATUS_ORDER.indexOf(currentStatus) >= STATUS_ORDER.indexOf(status) : false);
      return {
        status,
        label: STATUS_LABELS[status] || status.replaceAll('_', ' '),
        note: match?.note || '',
        createdAt: match?.createdAt || '',
        reached,
      };
    });

  const currentIndex = currentStatus ? STATUS_ORDER.indexOf(currentStatus) : -1;
  const activeIndex = timeline.findIndex(step => step.reached && !timeline[timeline.indexOf(step) + 1]?.reached);

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="relative">
        {/* Vertical line - positioned at exact center of icons (w-8/2=16px, w-10/2=20px) */}
        {timeline.length > 1 && (
          <div className="absolute left-[16px] sm:left-[20px] top-[16px] sm:top-[20px] bottom-[16px] sm:bottom-[20px] w-0.5 bg-gray-200"></div>
        )}
        
        <div className="space-y-4 sm:space-y-6">
          {timeline.map((step, idx) => {
            const isActive = idx === activeIndex;
            const isCompleted = step.reached && idx < activeIndex;
            const isPending = !step.reached;
            
            return (
              <div key={step.status} className="relative flex items-start gap-3 sm:gap-4">
                {/* Icon container */}
                <div className={`relative z-10 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-colors flex-shrink-0 ${
                  isCompleted 
                    ? 'bg-green-500 border-green-600 text-white' 
                    : isActive
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    getStatusIcon(step.status, "w-4 h-4 sm:w-5 sm:h-5")
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 pt-0.5 sm:pt-1 min-w-0">
                  <div className={`font-medium text-sm sm:text-base ${isCompleted || isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.label}
                  </div>
                  {step.createdAt && (isCompleted || isActive) && (
                    <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {formatTimestamp(step.createdAt)}
                    </div>
                  )}
                  {step.note && (isCompleted || isActive) && (
                    <div className="text-xs sm:text-sm text-muted-foreground mt-1 italic break-words">
                      {step.note}
                    </div>
                  )}
                  {isPending && (
                    <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Pending
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};