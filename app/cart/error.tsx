'use client';

import { useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useRouter } from 'next/navigation';

export default function CartError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    if (process.env["NODE_ENV"] === 'development') {
      console.error('Cart error:', error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4">
        <Alert variant="destructive">
          <AlertDescription className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Cart Error</h2>
              <p className="text-sm text-muted-foreground">
                There was a problem loading your cart. This might be due to a network issue or invalid cart data.
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={reset} variant="outline" size="sm">
                Retry
              </Button>
              <Button
                onClick={() => router.push('/products')}
                variant="outline"
                size="sm"
              >
                Continue shopping
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

