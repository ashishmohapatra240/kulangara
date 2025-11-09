'use client';

import { useEffect } from 'react';
import { Button } from './components/ui/button';
import { Alert, AlertDescription } from './components/ui/alert';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    if (process.env["NODE_ENV"] === 'development') {
      console.error('Root error:', error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4">
        <Alert variant="destructive">
          <AlertDescription className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
              <p className="text-sm text-muted-foreground">
                {error.message || 'An unexpected error occurred. Please try again.'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={reset} variant="outline" size="sm">
                Try again
              </Button>
              <Button
                onClick={() => (window.location.href = '/')}
                variant="outline"
                size="sm">
                Go home
              </Button>
            </div>
          </AlertDescription>
        </Alert>
        {process.env["NODE_ENV"] === 'development' && error.digest && (
          <p className="text-xs text-muted-foreground">Error ID: {error.digest}</p>
        )}
      </div>
    </div>
  );
}

