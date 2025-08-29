// Centralized permission utility for Sprintify
// Usage: import { can, ROLES, PERMISSIONS } from './permission';

export const ROLES = {
  MEMBER: "MEMBER",
  MODERATOR: "MODERATOR",
  ADMINISTRATOR: "ADMINISTRATOR",
};

export const PERMISSIONS = {
  // Task/issue/epic actions
  CREATE_TASK: "CREATE_TASK",
  UPDATE_TASK: "UPDATE_TASK",
  DELETE_TASK: "DELETE_TASK",
  // Sprint actions
  CREATE_SPRINT: "CREATE_SPRINT",
  UPDATE_SPRINT: "UPDATE_SPRINT",
  DELETE_SPRINT: "DELETE_SPRINT",
  // Board/status actions
  CONFIGURE_BOARD: "CONFIGURE_BOARD",
  CONFIGURE_STATUS: "CONFIGURE_STATUS",
  // Team actions
  INVITE_MEMBER: "INVITE_MEMBER",
  EDIT_ROLE: "EDIT_ROLE",
  REMOVE_MEMBER: "REMOVE_MEMBER",
  // Project settings
  EDIT_PROJECT: "EDIT_PROJECT",
  DELETE_PROJECT: "DELETE_PROJECT",
};

// Permission matrix
const rolePermissions = {
  MEMBER: [
    PERMISSIONS.CREATE_TASK,
    PERMISSIONS.UPDATE_TASK,
    PERMISSIONS.DELETE_TASK,
  ],
  MODERATOR: [
    PERMISSIONS.CREATE_TASK,
    PERMISSIONS.UPDATE_TASK,
    PERMISSIONS.DELETE_TASK,
    PERMISSIONS.CREATE_SPRINT,
    PERMISSIONS.UPDATE_SPRINT,
    PERMISSIONS.DELETE_SPRINT,
    PERMISSIONS.CONFIGURE_BOARD,
    PERMISSIONS.CONFIGURE_STATUS,
    PERMISSIONS.INVITE_MEMBER,
    PERMISSIONS.REMOVE_MEMBER, // Moderators can remove team members
  ],
  ADMINISTRATOR: Object.values(PERMISSIONS), // Administrators have all permissions
};

// Check if a role has a permission
export function can(role, permission) {
  if (!role) return false;
  return rolePermissions[role]?.includes(permission) || false;
}

// Additional permission utilities for complex scenarios
export function canRemoveProjectMember(
  userRole,
  targetUserId,
  currentUserId,
  projectCreatedBy,
  isTargetProjectCreator
) {
  // Cannot remove project creator
  if (isTargetProjectCreator || targetUserId === projectCreatedBy) {
    return { allowed: false, reason: "Cannot remove project creator" };
  }

  // Cannot remove yourself if you're the only administrator
  if (targetUserId === currentUserId && userRole === "ADMINISTRATOR") {
    return {
      allowed: false,
      reason: "Cannot remove yourself as the only administrator",
    };
  }

  // Check if user has REMOVE_MEMBER permission
  if (!can(userRole, PERMISSIONS.REMOVE_MEMBER)) {
    return {
      allowed: false,
      reason: "Insufficient permissions to remove members",
    };
  }

  return { allowed: true, reason: null };
}

export function canEditProjectSettings(
  userRole,
  projectCreatedBy,
  currentUserId
) {
  // Only administrators can edit project settings
  if (!can(userRole, PERMISSIONS.EDIT_PROJECT)) {
    return {
      allowed: false,
      reason: "Only administrators can edit project settings",
    };
  }

  return { allowed: true, reason: null };
}

export function canDeleteProject(userRole, projectCreatedBy, currentUserId) {
  // Only administrators can delete projects
  if (!can(userRole, PERMISSIONS.DELETE_PROJECT)) {
    return {
      allowed: false,
      reason: "Only administrators can delete projects",
    };
  }

  return { allowed: true, reason: null };
}

// Get role hierarchy level (higher number = more permissions)
export function getRoleLevel(role) {
  const levels = {
    MEMBER: 1,
    MODERATOR: 2,
    ADMINISTRATOR: 3,
  };
  return levels[role] || 0;
}

// Check if user can modify another user's role
export function canModifyUserRole(currentUserRole, targetUserRole) {
  const currentLevel = getRoleLevel(currentUserRole);
  const targetLevel = getRoleLevel(targetUserRole);

  // Must be administrator to modify roles
  if (!can(currentUserRole, PERMISSIONS.EDIT_ROLE)) {
    return { allowed: false, reason: "Insufficient permissions to edit roles" };
  }

  // Cannot modify role of someone with equal or higher role level
  if (targetLevel >= currentLevel) {
    return {
      allowed: false,
      reason: "Cannot modify role of user with equal or higher permissions",
    };
  }

  return { allowed: true, reason: null };
}
