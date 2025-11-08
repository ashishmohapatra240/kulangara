import { Skeleton } from '@/app/components/ui/skeleton';
import { Card, CardContent } from '@/app/components/ui/card';

export default function AdminOrdersLoading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>

        {/* Orders Table */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Table Header */}
              <div className="grid grid-cols-7 gap-4 pb-3 border-b">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <Skeleton key={i} className="h-5 w-24" />
                ))}
              </div>
              
              {/* Table Rows */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <div key={i} className="grid grid-cols-7 gap-4 py-3 items-center">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-5 w-24" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-40" />
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-10" />
            ))}
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    </div>
  );
}
