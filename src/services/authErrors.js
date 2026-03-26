/**
 * Maps Firebase authentication error codes to custom, user-friendly error messages.
 * 
 * @param {Error} error - The Firebase authentication error object
 * @returns {string} A user-friendly error message
 */
export const getCustomAuthErrorMessage = (error) => {
  const errorCode = error.code;
  
  const errorMessages = {
    // Invalid credentials
    "auth/invalid-credential": "Invalid email or password. Please check your credentials and try again.",
    "auth/user-not-found": "No account found with this email address.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    
    // Email validation
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/email-already-in-use": "An account with this email already exists.",
    
    // Password validation
    "auth/weak-password": "Password must be at least 6 characters long.",
    "auth/operation-not-allowed": "This login method is not currently enabled.",
    
    // Account status
    "auth/user-disabled": "This account has been disabled. Please contact support.",
    "auth/too-many-requests": "Too many failed login attempts. Please try again later.",
    
    // Network and other errors
    "auth/network-request-failed": "Network error. Please check your connection and try again.",
    "auth/internal-error": "An internal error occurred. Please try again.",
  };
  
  // Return custom message if available, otherwise return the Firebase error message
  return errorMessages[errorCode] || error.message;
};
