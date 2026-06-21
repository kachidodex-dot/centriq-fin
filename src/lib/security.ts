/**
 * Security utilities for rate limiting, CSRF protection, and input validation.
 */

/**
 * Simple in-memory rate limiter for authentication endpoints.
 * Tracks failed attempts per IP/email combination.
 *
 * Production: Replace with distributed rate limiting (Redis, etc.)
 */
interface RateLimitEntry {
  attempts: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

/** Configuration for rate limiting */
const RATE_LIMIT_CONFIG = {
  /** Max attempts before throttling */
  maxAttempts: 5,
  /** Window duration in milliseconds (15 minutes) */
  windowMs: 15 * 60 * 1000,
  /** Lockout duration in milliseconds (30 minutes) */
  lockoutMs: 30 * 60 * 1000,
};

/**
 * Checks if an identifier (IP, email, etc.) is rate limited.
 * Cleans up expired entries automatically.
 *
 * @param identifier Unique key (e.g., user email or IP address)
 * @returns true if rate limited, false if request allowed
 *
 * @example
 * ```ts
 * const email = 'user@example.com';
 * if (isRateLimited(email)) {
 *   throw new Error('Too many failed attempts. Try again in 30 minutes.');
 * }
 * recordFailedAttempt(email);
 * ```
 */
export function isRateLimited(identifier: string): boolean {
  const entry = rateLimitMap.get(identifier);

  if (!entry) return false;

  const now = Date.now();

  // Check if lockout period has expired
  if (now > entry.resetAt) {
    rateLimitMap.delete(identifier);
    return false;
  }

  return entry.attempts >= RATE_LIMIT_CONFIG.maxAttempts;
}

/**
 * Records a failed authentication attempt for rate limiting.
 * After max attempts, locks out the identifier for extended period.
 *
 * @param identifier Unique key (e.g., user email or IP address)
 */
export function recordFailedAttempt(identifier: string): void {
  const entry = rateLimitMap.get(identifier);
  const now = Date.now();

  if (!entry) {
    rateLimitMap.set(identifier, {
      attempts: 1,
      resetAt: now + RATE_LIMIT_CONFIG.windowMs,
    });
  } else {
    entry.attempts += 1;
    // If max attempts reached, set lockout period
    if (entry.attempts >= RATE_LIMIT_CONFIG.maxAttempts) {
      entry.resetAt = now + RATE_LIMIT_CONFIG.lockoutMs;
    } else {
      entry.resetAt = now + RATE_LIMIT_CONFIG.windowMs;
    }
  }
}

/**
 * Clears rate limit tracking for an identifier (e.g., after successful auth).
 * @param identifier Unique key to clear
 */
export function clearRateLimit(identifier: string): void {
  rateLimitMap.delete(identifier);
}

/**
 * Validates that a string is a properly formatted email address.
 * Basic validation - suitable for pre-submission checks.
 *
 * @param email Email address to validate
 * @returns true if email format is valid
 */
export function isValidEmail(email: string): boolean {
  // RFC 5322 simplified pattern
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email) && email.length <= 254;
}

/**
 * Validates password strength for security requirements.
 * Checks minimum length, character variety, and complexity.
 *
 * Requirements:
 * - At least 8 characters
 * - Contains at least one uppercase letter
 * - Contains at least one lowercase letter
 * - Contains at least one digit
 *
 * @param password Password to validate
 * @returns Object with validation result and failure reasons
 */
export function validatePasswordStrength(
  password: string,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain an uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain a lowercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain a digit");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitizes user input to prevent XSS attacks.
 * Removes potentially dangerous HTML/JavaScript.
 *
 * @param input Raw user input
 * @returns Sanitized string safe for display
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}
