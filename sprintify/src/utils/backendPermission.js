// Utility to map backend permission numbers to frontend role strings
// Based on the backend ProjectPermission enum

export const BACKEND_PERMISSIONS = {
  MEMBER: 1,
  MODERATOR: 2,
  ADMINISTRATOR: 3,
};

export const ROLE_NAMES = {
  1: "MEMBER",
  2: "MODERATOR", 
  3: "ADMINISTRATOR",
};

// Convert permission number to role string
export function getRoleFromPermission(permissionNumber) {
  return ROLE_NAMES[permissionNumber] || "MEMBER";
}

// Convert role string to permission number
export function getPermissionFromRole(roleName) {
  return BACKEND_PERMISSIONS[roleName] || 1;
}

// Check if user has specific permission level or higher
export function hasPermissionLevel(userPermission, requiredPermission) {
  return userPermission >= requiredPermission;
}