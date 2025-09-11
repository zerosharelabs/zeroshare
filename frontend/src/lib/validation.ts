/**
 * Simple text sanitization to prevent XSS
 * This is a basic implementation - for production apps consider using DOMPurify
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate if a string is a valid URL hash fragment
 */
export function isValidHashFragment(hash: string): boolean {
  // Should be exactly 32 characters (16 + 16)
  if (hash.length !== 32) return false;
  
  // Should only contain alphanumeric characters
  return /^[a-zA-Z0-9]+$/.test(hash);
}

/**
 * Validate password strength (basic validation)
 */
export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length === 0) {
    return { valid: true }; // Password is optional
  }
  
  if (password.length > 1000) {
    return { valid: false, message: "Password is too long (maximum 1000 characters)" };
  }
  
  return { valid: true };
}

/**
 * Validate data content
 */
export function validateSecretData(data: string): { valid: boolean; message?: string } {
  if (!data.trim()) {
    return { valid: false, message: "Please enter some data to share" };
  }
  
  // Check size (approximate, will be more after encryption)
  const sizeInBytes = new Blob([data]).size;
  const maxSize = 400 * 1024 * 1024; // 400MB to leave room for encryption overhead
  
  if (sizeInBytes > maxSize) {
    return { valid: false, message: "Data size exceeds maximum limit" };
  }
  
  return { valid: true };
}
