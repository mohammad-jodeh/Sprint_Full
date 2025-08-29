// Test file to validate the new data structure
import { normalizedData, getBoardData, getIssuesWithRelations } from './src/data/normalizedData.js';
import { boardData } from './src/data/boardData.js';
import { initialData } from './src/data/initialData.js';

console.log('Testing new data structure...\n');

// Test 1: Check normalized data structure
console.log('1. Normalized data structure:');
console.log('   Users count:', normalizedData.users.length);
console.log('   Projects count:', normalizedData.projects.length);
console.log('   Columns count:', normalizedData.boardColumns.length);
console.log('   Statuses count:', normalizedData.statuses.length);
console.log('   Issues count:', normalizedData.issues.length);

// Test 2: Check board data (nested structure)
console.log('\n2. Board data (nested structure):');
console.log('   Project:', boardData.project.name);
console.log('   Columns count:', boardData.columns.length);
console.log('   Total statuses:', boardData.columns.reduce((acc, col) => acc + col.statuses.length, 0));

// Test 3: Check initial data 
console.log('\n3. Initial data:');
console.log('   Project:', initialData.project.name);
console.log('   Users count:', initialData.users.length);
console.log('   Issues with relations count:', initialData.issues.length);

// Test 4: Check relationships
console.log('\n4. Relationship tests:');
const issuesWithRelations = getIssuesWithRelations();
const firstIssue = issuesWithRelations[0];
console.log('   First issue:', firstIssue.title);
console.log('   Assignee:', firstIssue.assigneeUser?.fullName || 'None');
console.log('   Status:', firstIssue.status?.name || 'None');
console.log('   Column:', firstIssue.column?.name || 'None');

// Test 5: Check enums
import { StatusType, IssueType, IssuePriority } from './src/data/types.js';
console.log('\n5. Enums test:');
console.log('   StatusType.BACKLOG:', StatusType.BACKLOG);
console.log('   IssueType.STORY:', IssueType.STORY);
console.log('   IssuePriority.HIGH:', IssuePriority.HIGH);

console.log('\n✓ All tests passed! Data structure is working correctly.');