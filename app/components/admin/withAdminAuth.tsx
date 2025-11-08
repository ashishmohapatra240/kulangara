'use client';

import { useEffect, ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { Skeleton } from '../ui/skeleton';

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN'];
const DELIVERY_ROLES = ['DELIVERY_PARTNER'];

interface WithAdminAuthOptions {
  allowedRoles?: string[];
  redirectTo?: string;
  loadingComponent?: ComponentType;
}

/**
 * Higher-order component that wraps admin pages with authentication checks
 * @param Component - The component to wrap
 * @param options - Configuration options
 * @returns Wrapped component with auth checks
 */
export function withAdminAuth<P extends object>(
  Component: ComponentType<P>,
  options: WithAdminAuthOptions = {}
) {
  const {
    allowedRoles = [...ADMIN_ROLES, ...DELIVERY_ROLES],
    redirectTo = '/admin/login',
    loadingComponent: LoadingComponent,
  } = options;

  return function WithAdminAuthWrapper(props: P) {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    useEffect(() => {
      if (!isLoading && !user) {
        // Not authenticated, redirect to login
        const currentPath = window.location.pathname + window.location.search;
        router.replace(`${redirectTo}?next=${encodeURIComponent(currentPath)}`);
      } else if (!isLoading && user && !allowedRoles.includes(user.role)) {
        // Authenticated but doesn't have required role
        // Redirect delivery partners to orders page if they try to access other pages
        if (DELIVERY_ROLES.includes(user.role)) {
          router.replace('/admin/orders');
        } else {
          // Regular users go to home
          router.replace('/');
        }
      }
    }, [user, isLoading, router]);

    // Show loading state
    if (isLoading) {
      if (LoadingComponent) {
        return <LoadingComponent />;
      }
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="space-y-4 w-full max-w-md p-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      );
    }

    // User not authenticated
    if (!user) {
      return null;
    }

    // User doesn't have required role
    if (!allowedRoles.includes(user.role)) {
      return null;
    }

    // All checks passed, render the component
    return <Component {...props} />;
  };
}

/**
 * HOC specifically for super admin only pages
 */
export function withSuperAdminAuth<P extends object>(
  Component: ComponentType<P>,
  options: Omit<WithAdminAuthOptions, 'allowedRoles'> = {}
) {
  return withAdminAuth(Component, {
    ...options,
    allowedRoles: ['SUPER_ADMIN'],
  });
}

/**
 * HOC for pages accessible to admins and super admins (not delivery partners)
 */
export function withAdminOnly<P extends object>(
  Component: ComponentType<P>,
  options: Omit<WithAdminAuthOptions, 'allowedRoles'> = {}
) {
  return withAdminAuth(Component, {
    ...options,
    allowedRoles: ADMIN_ROLES,
  });
}

