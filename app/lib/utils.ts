import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { AxiosError } from 'axios';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Standardized error response format from backend
 */
export interface ErrorResponse {
  status: 'error';
  message: string;
  code?: string;
  requestId?: string;
  errors?: Array<{ field: string; message: string }>;
}

/**
 * Enhanced error message extraction with support for new error response format
 * Supports validation errors, request IDs, and standardized error format
 */
export function getErrorMessage(error: AxiosError): string {
  if (error.response?.data && typeof error.response.data === 'object') {
    const data = error.response.data as Record<string, unknown>;
    
    // Check for new standardized error format
    if (data['status'] === 'error' && typeof data['message'] === 'string') {
      const errorResponse = data as unknown as ErrorResponse;
      
      // Log request ID in development for debugging
      if (errorResponse.requestId && process.env.NODE_ENV === 'development') {
        console.error(`[Error Request ID] ${errorResponse.requestId}`);
      }
      
      // If there are validation errors, combine them into a message
      if (errorResponse.errors && errorResponse.errors.length > 0) {
        const validationMessages = errorResponse.errors
          .map(err => `${err.field}: ${err.message}`)
          .join(', ');
        return `${errorResponse.message} (${validationMessages})`;
      }
      
      return errorResponse.message;
    }
    
    // Fallback to legacy format
    if (data["message"] && typeof data["message"] === 'string') {
      return data["message"] as string;
    }
  }
  
  // Handle rate limiting errors
  if (error.response?.status === 429) {
    const retryAfter = error.response.headers['retry-after'] || error.response.headers['Retry-After'];
    if (retryAfter) {
      return `Too many requests. Please try again after ${retryAfter} seconds.`;
    }
    return 'Too many requests. Please try again later.';
  }
  
  return error.message || 'An error occurred';
}

/**
 * Extract validation errors from error response
 * Returns an object with field names as keys and error messages as values
 */
export function getValidationErrors(error: AxiosError): Record<string, string> {
  const errors: Record<string, string> = {};
  
  if (error.response?.data && typeof error.response.data === 'object') {
    const data = error.response.data as Record<string, unknown>;
    
    if (data['status'] === 'error') {
      const errorResponse = data as unknown as ErrorResponse;
      if (errorResponse.errors && Array.isArray(errorResponse.errors)) {
        errorResponse.errors.forEach(err => {
          errors[err.field] = err.message;
        });
      }
    }
  }
  
  return errors;
}

/**
 * Extract request ID from error response for debugging
 */
export function getRequestId(error: AxiosError): string | undefined {
  if (error.response?.headers) {
    const requestId = error.response.headers['x-request-id'] || error.response.headers['X-Request-ID'];
    if (typeof requestId === 'string') {
      return requestId;
    }
  }
  
  if (error.response?.data && typeof error.response.data === 'object') {
    const data = error.response.data as Record<string, unknown>;
    if (data['status'] === 'error') {
      const errorResponse = data as unknown as ErrorResponse;
      return errorResponse.requestId;
    }
  }
  
  return undefined;
}
