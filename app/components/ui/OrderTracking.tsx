"use client";

import { ITrackingHistoryItem } from "@/app/types/order.type";

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

export const OrderTrackingComponent = ({ tracking, currentStatus }: OrderTrackingProps) => {
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Build a timeline based on enum order; enrich with timestamps if available in history
  const timeline = STATUS_ORDER
    .filter((s) => s !== 'CANCELLED' && s !== 'RETURNED' && s !== 'REFUNDED')
    .map((status) => {
      const match = tracking.find((t) => t.status === status);
      return {
        status,
        note: match?.note || '',
        createdAt: match?.createdAt || '',
        reached: !!match || (currentStatus ? STATUS_ORDER.indexOf(currentStatus) >= STATUS_ORDER.indexOf(status) : false),
      };
    });

  return (
    <div className="p-4 border-b border-gray-200 bg-blue-50">
      <h4 className="font-medium text-gray-900 mb-3">Tracking</h4>
      <div className="flex items-stretch">
        {timeline.map((step, idx) => (
          <div key={step.status} className="flex-1 flex flex-col items-center text-center">
            <div className="flex items-center w-full">
              {/* Left connector */}
              {idx > 0 && (
                <div className={`h-1 flex-1 ${timeline[idx - 1]?.reached ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              )}
              {/* Dot */}
              <div className={`w-4 h-4 rounded-full border-2 ${step.reached ? 'bg-green-500 border-green-600' : 'bg-white border-gray-300'}`}></div>
              {/* Right connector */}
              {idx < timeline.length - 1 && (
                <div className={`h-1 flex-1 ${step.reached ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              )}
            </div>
            <div className={`mt-2 text-xs ${step.reached ? 'text-gray-900' : 'text-gray-400'}`}>{step.status.replaceAll('_', ' ')}</div>
            <div className="mt-1 text-[10px] text-gray-500">{step.createdAt ? formatTimestamp(step.createdAt) : ''}</div>
          </div>
        ))}
      </div>
    </div>
  );
};