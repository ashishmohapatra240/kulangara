'use client';

import { useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useRouter } from 'next/navigation';

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Checkout error:', error);
    }
  }, [error]);

  const isStockError = error.message?.includes('stock') || error.message?.includes('available');
  const isPaymentError = error.message?.includes('payment') || error.message?.includes('Payment');

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4">
        <Alert variant="destructive">
          <AlertDescription className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">
                {isStockError
                  ? 'Product Availability Issue'
                  : isPaymentError
                  ? 'Payment Error'
                  : 'Checkout Error'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isStockError
                  ? 'Some items in your cart are no longer available. Please review your cart and try again.'
                  : isPaymentError
                  ? 'There was an issue processing your payment. No charges were made.'
                  : 'There was a problem processing your checkout. Please try again or contact support.'}
              </p>
            </div>
            <div className="flex gap-2">
              {!isStockError && (
                <Button onClick={reset} variant="outline" size="sm">
                  Try again
                </Button>
              )}
              <Button
                onClick={() => router.push('/cart')}
                variant="outline"
                size="sm"
              >
                View cart
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

