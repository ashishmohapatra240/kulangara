import { Skeleton } from '../components/ui/skeleton';
import { Card, CardContent } from '../components/ui/card';

export default function CartLoading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Skeleton className="h-10 w-48 mb-8" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items skeleton */}
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Skeleton className="w-24 h-24 rounded-lg" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-9 w-32" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order summary skeleton */}
          <div>
            <Card>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-3">
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

