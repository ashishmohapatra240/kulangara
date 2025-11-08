/**
 * Common validation utilities for forms and user input
 */

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns True if valid email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Indian format)
 * @param phone - Phone number to validate
 * @returns True if valid phone format
 */
export function isValidPhone(phone: string): boolean {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  // Check if it's 10 digits (Indian format)
  return digits.length === 10;
}

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with validation result and message
 */
export function validatePassword(password: string): {
  isValid: boolean;
  message: string;
} {
  if (password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long',
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter',
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one lowercase letter',
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one number',
    };
  }

  return {
    isValid: true,
    message: 'Password is strong',
  };
}

/**
 * Validate Indian PIN code
 * @param pincode - PIN code to validate
 * @returns True if valid PIN code
 */
export function isValidPincode(pincode: string): boolean {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
}

/**
 * Validate required field
 * @param value - Value to check
 * @returns True if value is not empty
 */
export function isRequired(value: string | number | null | undefined): boolean {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return true;
}

/**
 * Validate minimum length
 * @param value - Value to check
 * @param min - Minimum length
 * @returns True if value meets minimum length
 */
export function minLength(value: string, min: number): boolean {
  return value.trim().length >= min;
}

/**
 * Validate maximum length
 * @param value - Value to check
 * @param max - Maximum length
 * @returns True if value doesn't exceed maximum length
 */
export function maxLength(value: string, max: number): boolean {
  return value.trim().length <= max;
}

/**
 * Validate number is within range
 * @param value - Number to check
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns True if number is within range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Validate URL format
 * @param url - URL to validate
 * @returns True if valid URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize user input to prevent XSS
 * @param input - User input to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate credit card number using Luhn algorithm
 * @param cardNumber - Card number to validate
 * @returns True if valid card number
 */
export function isValidCardNumber(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  
  if (digits.length < 13 || digits.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

