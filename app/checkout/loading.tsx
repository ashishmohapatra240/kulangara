import { Skeleton } from '../components/ui/skeleton';
import { Card, CardContent } from '../components/ui/card';

export default function CheckoutLoading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Skeleton className="h-10 w-48 mb-8" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout form skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping address section */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment method section */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Coupon section */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order summary skeleton */}
          <div>
            <Card className="sticky top-4">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="w-16 h-16 rounded" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-11 w-full mt-6" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

