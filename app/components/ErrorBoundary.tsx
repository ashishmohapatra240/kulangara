'use client';

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (process.env["NODE_ENV"] === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  override render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-4">
            <Alert variant="destructive">
              <AlertDescription className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold mb-2">
                    Something went wrong
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {this.state.error?.message ||
                      'An unexpected error occurred. Please try again.'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={this.handleReset} variant="outline" size="sm">
                    Try again
                  </Button>
                  <Button
                    onClick={() => (window.location.href = '/')}
                    variant="outline"
                    size="sm"
                  >
                    Go home
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
            {process.env["NODE_ENV"] === 'development' && this.state.error && (
              <details className="text-xs p-4 bg-muted rounded-lg">
                <summary className="cursor-pointer font-semibold mb-2">
                  Error details (development only)
                </summary>
                <pre className="whitespace-pre-wrap overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

