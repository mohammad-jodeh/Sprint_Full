export const validatePassword = (password) => {
  const minLength = 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  
  const errors = [];
  
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  if (!hasNumber) {
    errors.push('Password must contain at least one number');
  }
  if (!hasSpecialChar) {
    errors.push('Password must contain at least one special character');
  }
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength: getPasswordStrength(password)
  };
};

// Calculates password strength on a scale of 0-100
export const getPasswordStrength = (password) => {
  if (!password) return 0;
  
  // Basic checks
  const length = Math.min(password.length * 4, 40); // Max 40 points for length
  const hasNumber = /\d/.test(password) ? 10 : 0;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password) ? 15 : 0;
  const hasUpperCase = /[A-Z]/.test(password) ? 10 : 0;
  const hasLowerCase = /[a-z]/.test(password) ? 10 : 0;
  
  // Variety bonus (more unique characters = stronger)
  const uniqueChars = new Set(password).size;
  const varietyBonus = Math.min(uniqueChars * 2, 15); // Max 15 points
  
  // Calculate total strength
  const strength = Math.min(
    length + hasNumber + hasSpecialChar + hasUpperCase + hasLowerCase + varietyBonus,
    100
  );
  
  return strength;
};

// Returns a descriptive strength label based on score
export const getStrengthLabel = (strength) => {
  if (strength < 30) return { label: 'Very Weak', color: 'red-500' };
  if (strength < 50) return { label: 'Weak', color: 'orange-500' };
  if (strength < 70) return { label: 'Medium', color: 'yellow-500' };
  if (strength < 90) return { label: 'Strong', color: 'green-400' };
  return { label: 'Very Strong', color: 'green-500' };
};

// Checks if passwords match
export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};