'use client';

import { useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useRouter } from 'next/navigation';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Admin error:', error);
    }
  }, [error]);

  const isAuthError = error.message?.includes('401') || error.message?.includes('Unauthorized');

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full space-y-4">
        <Alert variant="destructive">
          <AlertDescription className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">
                {isAuthError ? 'Authentication Error' : 'Admin Panel Error'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isAuthError
                  ? 'Your session has expired or you do not have permission to access this area.'
                  : 'There was a problem loading the admin panel. Please try again.'}
              </p>
            </div>
            <div className="flex gap-2">
              {isAuthError ? (
                <Button
                  onClick={() => router.push('/admin/login')}
                  variant="outline"
                  size="sm"
                >
                  Go to login
                </Button>
              ) : (
                <>
                  <Button onClick={reset} variant="outline" size="sm">
                    Try again
                  </Button>
                  <Button
                    onClick={() => router.push('/admin')}
                    variant="outline"
                    size="sm"
                  >
                    Go to dashboard
                  </Button>
                </>
              )}
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
