import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export class AppError extends Error {
  public code?: string;
  public status?: number;
  public details?: any;

  constructor(message: string, options: { code?: string; status?: number; details?: any } = {}) {
    super(message);
    this.name = 'AppError';
    this.code = options.code;
    this.status = options.status;
    this.details = options.details;
  }
}

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, {
      code: 'unknown_error',
      details: error
    });
  }

  return new AppError('An unexpected error occurred', {
    code: 'unknown_error',
    details: error
  });
}

export function getErrorMessage(error: unknown): string {
  const appError = handleError(error);
  
  // Handle Supabase-specific errors
  if (appError.details?.error_description) {
    return appError.details.error_description;
  }
  
  if (appError.details?.message) {
    return appError.details.message;
  }

  // Handle validation errors
  if (appError.code === 'validation_error') {
    return appError.message || 'Please check your input and try again';
  }

  // Handle authentication errors
  if (appError.code?.startsWith('auth_')) {
    switch (appError.code) {
      case 'auth_invalid_credentials':
        return 'Invalid email or password';
      case 'auth_email_in_use':
        return 'This email is already registered';
      case 'auth_weak_password':
        return 'Password is too weak. Please use at least 6 characters';
      default:
        return 'Authentication failed. Please try again';
    }
  }

  // Handle database errors
  if (appError.code?.startsWith('db_')) {
    return 'A database error occurred. Please try again';
  }

  return appError.message || 'An unexpected error occurred';
}