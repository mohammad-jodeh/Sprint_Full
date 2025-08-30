# Backend-Structured Data Implementation

## Overview

The frontend data structure has been completely refactored to follow the backend TypeORM entity structure exactly, eliminating reliance on json.db and ensuring consistency between frontend and backend.

## Entity Structure

### Core Entities (Matching Backend)

1. **BaseEntity Properties** (inherited by all entities)
   - `createdAt`: Date
   - `updatedAt`: Date
   - `deletedAt`: Date | null

2. **User Entity**
   - `id`: string (UUID)
   - `email`: string (unique)
   - `isEmailVerified`: boolean
   - `password`: string
   - `fullName`: string
   - `image`: string | null

3. **Project Entity**
   - `id`: string (UUID)
   - `name`: string
   - `keyPrefix`: string (unique)
   - `createdBy`: string (User ID)
   - `activeSprintId`: string | null

4. **ProjectMember Entity**
   - `id`: string (UUID)
   - `permission`: ProjectPermission enum
   - `userId`: string
   - `projectId`: string

5. **BoardColumn Entity**
   - `id`: string (UUID)
   - `name`: string
   - `order`: number
   - `projectId`: string

6. **Status Entity**
   - `id`: string (UUID)
   - `name`: string
   - `type`: StatusType enum
   - `columnId`: string
   - `projectId`: string

7. **Sprint Entity**
   - `id`: string (UUID)
   - `name`: string
   - `startDate`: Date
   - `endDate`: Date
   - `projectId`: string
   - `archived`: boolean

8. **Epic Entity**
   - `id`: string (UUID)
   - `key`: string
   - `title`: string
   - `description`: string
   - `assignee`: string | null
   - `projectId`: string

9. **Issue Entity**
   - `id`: string (UUID)
   - `key`: string
   - `title`: string
   - `description`: string
   - `storyPoint`: number
   - `statusId`: string
   - `assignee`: string | null
   - `epicId`: string | null
   - `sprintId`: string | null
   - `projectId`: string
   - `issuePriority`: IssuePriority enum
   - `type`: IssueType enum

10. **Comment Entity** (New)
    - `id`: string (UUID)
    - `issueId`: string
    - `userId`: string
    - `content`: string

11. **IssueLink Entity** (New)
    - `id`: string (UUID)
    - `fromIssueId`: string
    - `toIssueId`: string
    - `linkType`: string ("BLOCKS", "RELATES_TO", "DEPENDS_ON")

12. **Notification Entity** (New)
    - `id`: string (UUID)
    - `title`: string
    - `message`: string
    - `type`: NotificationType enum
    - `priority`: NotificationPriority enum
    - `recipientId`: string
    - `senderId`: string | null
    - `isRead`: boolean
    - `metadata`: object | null
    - `actionUrl`: string | null
    - `emailSent`: boolean

## Enums (Matching Backend)

```javascript
// From backend enums.ts
export const IssueType = {
  BUG: "Bug",
  STORY: "Story",
  TASK: "Task"
};

export const StatusType = {
  BACKLOG: 0,
  IN_PROGRESS: 1,
  DONE: 2
};

export const ProjectPermission = {
  MEMBER: 0,
  MODERATOR: 1,
  ADMINISTRATOR: 2
};

export const IssuePriority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH"
};

export const NotificationType = {
  PROJECT_INVITATION: 1,
  ISSUE_UPDATED: 2,
  SPRINT_UPDATED: 3,
  EPIC_UPDATED: 4,
  PROJECT_UPDATED: 5
};

export const NotificationPriority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT"
};
```

## Data Access Patterns

### Normalized Structure
All entities are stored as separate arrays following database normalization principles:

```javascript
export const normalizedData = {
  users,
  projects,
  projectMembers,
  boardColumns,
  statuses,
  sprints,
  epics,
  issues,
  comments,
  issueLinks,
  notifications
};
```

### Helper Functions
Utility functions for data access and relationship building:

- `getIssuesWithRelations()` - Issues with populated relationships
- `getColumnsWithStatuses()` - Columns with nested statuses
- `getCommentsForIssue(issueId)` - Comments for specific issue
- `getLinksForIssue(issueId)` - Links for specific issue
- `getNotificationsForUser(userId)` - User notifications

### Backward Compatibility
- `initialData.js` - Maintains flat structure for existing board store
- `boardData.js` - Provides nested structure for legacy components

## Benefits

1. **Consistency**: Frontend data structure exactly matches backend entities
2. **Type Safety**: Proper enums and types matching backend
3. **Normalization**: Eliminates data duplication and ensures referential integrity
4. **Scalability**: Easy to add new entities and relationships
5. **Maintainability**: Single source of truth for data structure
6. **Flexibility**: Both normalized and denormalized access patterns available

## Migration Impact

- ✅ Existing board store functionality preserved
- ✅ All existing components continue to work
- ✅ Build process unaffected
- ✅ No breaking changes to existing API

## Usage Examples

```javascript
// Get all issues with full relationship data
const issuesWithRelations = getIssuesWithRelations();

// Get comments for a specific issue
const comments = getCommentsForIssue('issue-1');

// Get board data in nested format (for UI components)
const boardData = getBoardData();

// Access normalized entities directly
const { users, projects, issues } = normalizedData;
```

This implementation provides a robust, scalable foundation that mirrors the backend architecture while maintaining full compatibility with existing frontend code.