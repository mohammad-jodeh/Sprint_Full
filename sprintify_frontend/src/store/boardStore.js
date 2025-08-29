import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialData } from '../data/initialData';
import { createBoardColumn, deleteBoardColumn, updateBoardColumn, updateColumnOrders } from '../api/boardColumns';

export const useBoardStore = create(
  persist(
    (set, get) => ({
      // State
      board: initialData,
      filters: {
        selectedUsers: [],
        selectedSprints: [],
        showUnassigned: false
      },
      
      // Actions
      moveIssue: (sourceStatusId, destinationStatusId, issueId) => {
        set((state) => {
          const newIssues = state.board.issues.map(issue =>
            issue.id === issueId
              ? { ...issue, statusId: destinationStatusId }
              : issue
          );
          
          return {
            board: {
              ...state.board,
              issues: newIssues
            }
          };
        });
      },

      addIssue: (statusId, issue) => {
        set((state) => {
          const newIssue = {
            id: `issue-${Date.now()}`,
            createdAt: new Date().toISOString(),
            statusId,
            projectId: state.board.project.id,
            ...issue
          };

          return {
            board: {
              ...state.board,
              issues: [...state.board.issues, newIssue]
            }
          };
        });
      },      addColumn: async (projectId, columnData) => {
        try {
          const newColumn = await createBoardColumn(projectId, columnData);
          set((state) => ({
            board: {
              ...state.board,
              columns: [...state.board.columns, newColumn]
            }
          }));
          return newColumn;
        } catch (error) {
          console.error('Failed to add column:', error);
          throw error;
        }
      },

      updateColumn: async (projectId, columnId, updates) => {
        try {
          const updatedColumn = await updateBoardColumn(projectId, columnId, updates);
          set((state) => {
            const newColumns = state.board.columns.map(column =>
              column.id === columnId
                ? { ...column, ...updatedColumn }
                : column
            );

            return {
              board: {
                ...state.board,
                columns: newColumns
              }
            };
          });
          return updatedColumn;
        } catch (error) {
          console.error('Failed to update column:', error);
          throw error;
        }
      },

      removeColumn: async (projectId, columnId) => {
        try {
          await deleteBoardColumn(projectId, columnId);
          set((state) => {
            const newColumns = state.board.columns.filter(c => c.id !== columnId);

            return {
              board: {
                ...state.board,
                columns: newColumns
              }
            };
          });
        } catch (error) {
          console.error('Failed to remove column:', error);
          throw error;
        }
      },

      updateIssue: (issueId, updates) => {
        set((state) => {
          const newIssues = state.board.issues.map(issue =>
            issue.id === issueId
              ? { ...issue, ...updates }
              : issue
          );

          return {
            board: {
              ...state.board,
              issues: newIssues
            }
          };
        });
      },

      removeIssue: (issueId) => {
        set((state) => {
          const newIssues = state.board.issues.filter(issue => issue.id !== issueId);

          return {
            board: {
              ...state.board,
              issues: newIssues
            }
          };
        });
      },

      addStatus: (columnId, status) => {
        set((state) => {
          const newColumns = state.board.columns.map(column =>
            column.id === columnId
              ? {
                  ...column,
                  statuses: [
                    ...column.statuses,
                    {
                      id: `status-${Date.now()}`,
                      column_id: columnId,
                      ...status
                    }
                  ]
                }
              : column
          );

          return {
            board: {
              ...state.board,
              columns: newColumns
            }
          };
        });
      },

      updateStatus: (statusId, updates) => {
        set((state) => {
          const newColumns = state.board.columns.map(column => ({
            ...column,
            statuses: column.statuses.map(status =>
              status.id === statusId
                ? { ...status, ...updates }
                : status
            )
          }));

          return {
            board: {
              ...state.board,
              columns: newColumns
            }
          };
        });
      },

      removeStatus: (statusId) => {
        set((state) => {
          const newColumns = state.board.columns.map(column => ({
            ...column,
            statuses: column.statuses.filter(status => status.id !== statusId)
          }));

          return {
            board: {
              ...state.board,
              columns: newColumns
            }
          };
        });
      },

      // Update column orders for drag and drop
      reorderColumns: async (projectId, newColumnOrder) => {
        try {
          // Optimistically update the UI
          set((state) => ({
            board: {
              ...state.board,
              columns: newColumnOrder
            }
          }));

          // Prepare updates for backend
          const columnUpdates = newColumnOrder.map((column, index) => ({
            id: column.id,
            order: index
          }));

          // Update backend
          await updateColumnOrders(projectId, columnUpdates);
        } catch (error) {
          console.error('Failed to reorder columns:', error);
          // Revert on error - could add toast notification here
          throw error;
        }
      },

      // Utility actions
      resetBoard: () => {
        set({ board: initialData });
      },

      // Filter actions
      setFilters: (newFilters) => {
        set({ filters: newFilters });
      },

      clearFilters: () => {
        set({
          filters: {
            selectedUsers: [],
            selectedSprints: [],
            showUnassigned: false
          }
        });
      },

      // Getters (derived state)
      getIssuesForStatus: (statusId) => {
        const { board, filters } = get();
        let issues = board.issues.filter(issue => issue.statusId === statusId);
        return get().applyFilters(issues);
      },

      getIssuesForColumn: (columnId) => {
        const { board, filters } = get();
        const column = board.columns.find(col => col.id === columnId);
        if (!column) return [];
        
        const statusIds = column.statuses.map(status => status.id);
        let issues = board.issues.filter(issue => statusIds.includes(issue.statusId));
        return get().applyFilters(issues);
      },

      getAllStatuses: () => {
        const { board } = get();
        return board.columns.flatMap(column => column.statuses);
      },

      applyFilters: (issues) => {
        const { filters } = get();
        let filteredIssues = [...issues];

        // Filter by users
        if (filters.selectedUsers.length > 0 || filters.showUnassigned) {
          filteredIssues = filteredIssues.filter(issue => {
            // Show unassigned issues if showUnassigned is true
            if (filters.showUnassigned && (!issue.assignee || issue.assignee === null)) {
              return true;
            }
            // Show issues assigned to selected users
            if (filters.selectedUsers.length > 0 && issue.assignee) {
              return filters.selectedUsers.includes(issue.assignee);
            }
            // If only showUnassigned is false and no users selected, show all
            if (!filters.showUnassigned && filters.selectedUsers.length === 0) {
              return true;
            }
            return false;
          });
        }

        // Filter by sprints
        if (filters.selectedSprints.length > 0) {
          filteredIssues = filteredIssues.filter(issue => {
            return issue.sprintId && filters.selectedSprints.includes(issue.sprintId);
          });
        }

        return filteredIssues;
      }
    }),
    {
      name: 'board-storage',
      partialize: (state) => ({ 
        board: state.board,
        filters: state.filters 
      })
    }
  )
);
