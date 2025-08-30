import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Calendar, Target, User2 } from "lucide-react";
import { getPriorityConfig } from "../../utils/priorityUtils";

const SprintBoardSection = ({ 
  sprint, 
  issues, 
  onIssueClick, 
  isBacklog = false 
}) => {
  const sectionId = isBacklog ? "backlog" : sprint.id;
  const sectionTitle = isBacklog ? "Backlog" : sprint.name;
  const issueCount = issues.length;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  const IssueCard = ({ issue, index }) => {
    const priorityConfig = getPriorityConfig(issue.issuePriority || issue.priority);
    
    return (
      <Draggable draggableId={issue.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`
              bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 
              p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-blue-300
              ${snapshot.isDragging ? 'rotate-2 shadow-lg' : ''}
            `}
            onClick={() => onIssueClick && onIssueClick(issue)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                  {issue.key || `#${issue.id.slice(-6)}`}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${priorityConfig.bgColor} ${priorityConfig.textColor}`}>
                  {priorityConfig.label}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                  {issue.storyPoint || 0} pts
                </span>
              </div>
            </div>
            
            <h4 className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
              {issue.title}
            </h4>
            
            {issue.epic && (
              <div className="mb-2">
                <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">
                  🔖 {issue.epic.title || issue.epic.name}
                </span>
              </div>
            )}
            
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                {issue.assigneeUser ? (
                  <div className="flex items-center gap-1">
                    {issue.assigneeUser.image ? (
                      <img 
                        src={issue.assigneeUser.image} 
                        alt={issue.assigneeUser.fullName}
                        className="w-5 h-5 rounded-full"
                      />
                    ) : (
                      <User2 size={14} />
                    )}
                    <span className="truncate max-w-16">
                      {issue.assigneeUser.fullName?.split(" ")[0] || "Unassigned"}
                    </span>
                  </div>
                ) : (
                  <span>Unassigned</span>
                )}
              </div>
              <span>{formatDate(issue.updatedAt)}</span>
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-4 min-w-80">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isBacklog ? (
            <div className="w-6 h-6 bg-gray-500 rounded flex items-center justify-center">
              <Target size={14} className="text-white" />
            </div>
          ) : (
            <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
              <Calendar size={14} className="text-white" />
            </div>
          )}
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {sectionTitle}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {issueCount} issues
          </span>
        </div>
      </div>

      {!isBacklog && sprint.startDate && sprint.endDate && (
        <div className="mb-4 text-xs text-gray-500 dark:text-gray-400">
          {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
        </div>
      )}

      <Droppable droppableId={sectionId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              min-h-32 space-y-3 transition-colors duration-200
              ${snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600' : ''}
            `}
          >
            {issues.map((issue, index) => (
              <IssueCard key={issue.id} issue={issue} index={index} />
            ))}
            {provided.placeholder}
            
            {issues.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <div className="mb-2">📝</div>
                <div className="text-sm">
                  {isBacklog ? "No unassigned issues" : "No issues in this sprint"}
                </div>
                <div className="text-xs">
                  Drag issues here
                </div>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default SprintBoardSection;