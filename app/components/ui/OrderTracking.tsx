"use client";

import { ITrackingHistoryItem } from "@/app/types/order.type";

interface OrderTrackingProps {
  tracking: ITrackingHistoryItem[];
  onClose: () => void;
}

export const OrderTrackingComponent = ({ tracking, onClose }: OrderTrackingProps) => {
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-4 border-b border-gray-200 bg-blue-50">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium text-gray-900">Tracking Information</h4>
        <button
          onClick={onClose}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          Hide Tracking
        </button>
      </div>
      
      {tracking.length > 0 ? (
        <div className="space-y-3">
          {tracking.map((track: ITrackingHistoryItem) => (
            <div key={track.id} className="bg-white p-3 rounded-md border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{track.status}</div>
                  <div className="text-sm text-gray-600 mt-1">{track.note}</div>
                </div>
                <div className="text-xs text-gray-500 ml-3 text-right">
                  {formatTimestamp(track.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="text-gray-500 text-sm">No tracking information available</div>
          <div className="text-gray-400 text-xs mt-1">Check back later for updates</div>
        </div>
      )}
    </div>
  );
}; 