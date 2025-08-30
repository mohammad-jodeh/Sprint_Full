import React, { useState, useRef, useEffect } from "react";
import useThemeStore from "../store/themeStore";
import { createTask } from "../api/tasks";
import { fetchProjectById } from "../api/project";
import { fetchEpics } from "../api/epics";
import { getProjectMembers } from "../api/projectMembers";
import { fetchSprints } from "../api/sprints";
import { fetchStatuses } from "../api/statuses";
import { fetchTasks } from "../api/tasks";
import { fetchBoardColumns } from "../api/boardColumns";
import { sendToGemini } from "../api/gemini";
import toast from "react-hot-toast";
import {
  X,
  Send,
  Bot,
  User,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Lightbulb,
  ArrowUpRight,
  Bug,
  CheckCircle2,
  AlertCircle as CircleAlert,
  ClipboardList,
} from "lucide-react";
import Portal from "./ui/Portal";
import IssueDetailsModal from "./modals/IssueDetailsModal";

// Board Issue Card Utility Functions (matching board styling)
const getIssueColor = (issue) => {
  if (issue.epic || issue.epicId) {
    return "border-accent";
  } else if (issue.storyPoints >= 5) {
    return "border-primary";
  } else if (issue.storyPoints <= 2) {
    return "border-error";
  } else {
    return "border-secondary";
  }
};

const getIssueTypeIcon = (issue) => {
  if (issue.epic || issue.epicId) {
    return <ArrowUpRight className="h-4 w-4 text-accent" />;
  } else if (issue.storyPoints >= 5) {
    return <ClipboardList className="h-4 w-4 text-primary" />; // Story
  } else if (issue.storyPoints <= 2) {
    return <Bug className="h-4 w-4 text-error" />; // Bug
  } else {
    return <CheckCircle2 className="h-4 w-4 text-secondary" />; // Task
  }
};

const getPriorityIcon = (issue) => {
  const storyPoints = issue.storyPoints || 0;

  if (storyPoints >= 5) {
    return <CircleAlert className="h-4 w-4 text-error" />; // High priority
  } else if (storyPoints >= 3) {
    return <CircleAlert className="h-4 w-4 text-warning" />; // Medium priority
  } else {
    return <CircleAlert className="h-4 w-4 text-success" />; // Low priority
  }
};

const getIssueKey = (issue, index) => {
  return `AI-${index + 1}`;
};

const AIChatAssistant = ({ projectId, isOpen, onClose }) => {
  const { theme } = useThemeStore();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const [epics, setEpics] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [columns, setColumns] = useState([]);

  // AI suggestion states
  const [suggestedIssues, setSuggestedIssues] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedIssueForDetails, setSelectedIssueForDetails] = useState(null);
  const [showIssueDetails, setShowIssueDetails] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && projectId) {
      loadProjectData();
      // Focus input when modal opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, projectId]);
  const loadProjectData = async () => {
    try {
      const [project, epicsData, membersData, sprintsData, columnsData] =
        await Promise.all([
          fetchProjectById(projectId),
          fetchEpics({ projectId }),
          getProjectMembers(projectId),
          fetchSprints(projectId),
          fetchBoardColumns(projectId),
        ]);

      // Get all statuses for the project
      const allStatuses = await fetchStatuses({ projectId });
      const columnIds = columnsData.map((col) => col.id);
      const projectStatuses = allStatuses.filter((status) =>
        columnIds.includes(status.columnId)
      );

      setProjectData(project);
      setEpics(epicsData);
      setProjectMembers(membersData);
      setSprints(sprintsData);
      setStatuses(projectStatuses);

      // Store columns data for enhanced AI context
      setColumns(columnsData);
    } catch (error) {
      console.error("Failed to load project data:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = { role: "user", content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const aiResponse = await handleAIRequest(inputMessage);

      const assistantMessage = {
        role: "assistant",
        content: aiResponse.message,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      if (aiResponse.suggestedIssues && aiResponse.suggestedIssues.length > 0) {
        // Show confirmation modal for AI suggestions instead of auto-creating
        setSuggestedIssues(aiResponse.suggestedIssues);
        setShowConfirmModal(true);
      }
    } catch (error) {
      console.error("Error communicating with AI:", error);
      const errorMessage = {
        role: "assistant",
        content:
          "Sorry, I encountered an error. Please try again. Make sure you're on a project page where I can create issues.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleAIRequest = async (message) => {
    // Validate we have project context
    if (!projectData || !projectId) {
      throw new Error("No project context available");
    }

    // Define available types and priorities
    const availableTypes = [
      {
        label: "Task",
        value: "Task",
        description: "General development tasks",
      },
      { label: "Bug", value: "Bug", description: "Bug fixes and issues" },
      {
        label: "Story",
        value: "Story",
        description: "User stories and features",
      },
    ];

    const availablePriorities = [
      { label: "Low", value: "LOW", description: "Low priority items" },
      {
        label: "Medium",
        value: "MEDIUM",
        description: "Medium priority items",
      },
      {
        label: "High",
        value: "HIGH",
        description: "High priority, urgent items",
      },
    ];

    // Create enhanced project context for the AI prompt
    const projectContext = {
      title: projectData?.name || "Unknown Project",
      description: projectData?.description || "",
      epics: epics.map((epic) => ({
        id: epic.id,
        name: epic.name || epic.title,
        description: epic.description,
      })),
      sprints: sprints.map((sprint) => {
        // Determine if sprint is active by status/flag or date range
        const isActiveByStatus = sprint.status === "active" || sprint.isActive;
        const isActiveByDate =
          !sprint.archived &&
          sprint.startDate &&
          sprint.endDate &&
          new Date(sprint.startDate) <= new Date() &&
          new Date(sprint.endDate) >= new Date();
        const isActive = isActiveByStatus || isActiveByDate;

        return {
          id: sprint.id,
          name: sprint.name,
          status: sprint.status || (isActive ? "active" : "planned"),
          isActive: isActive,
          startDate: sprint.startDate,
          endDate: sprint.endDate,
          description: isActive
            ? "Current active sprint - assign issues here if they should be worked on immediately"
            : "Future or past sprint",
        };
      }),
      members: projectMembers.map((member) => ({
        id: member.userId,
        name: member.user?.fullName || member.user?.email || "Unknown User",
        email: member.user?.email,
      })),
      workflow: {
        columns: columns.map((column) => ({
          id: column.id,
          name: column.name,
          order: column.order,
          description: `Column ${column.order}: ${column.name}`,
        })),
        statuses: statuses.map((status) => ({
          id: status.id,
          name: status.name,
          type: status.type, // 0 = TODO, 1 = IN_PROGRESS, 2 = DONE
          columnId: status.columnId,
          columnName:
            columns.find((col) => col.id === status.columnId)?.name ||
            "Unknown",
          description: `${status.name} status in ${
            columns.find((col) => col.id === status.columnId)?.name || "Unknown"
          } column`,
        })),
        boardFlow:
          "Issues flow from Backlog → To Do → In Progress → Code Review → Testing → Done",
      },
      issueConfig: {
        types: availableTypes,
        priorities: availablePriorities,
        storyPointOptions: [1, 2, 3, 5, 8, 13],
      },
      projectId: projectId,
      instructions: {
        sprintAssignment:
          "Only assign issues to sprints if specifically requested. If no sprint is mentioned, leave unassigned so issues go to backlog for future planning.",
        statusAssignment:
          "Use appropriate status based on issue type and priority. Default to TODO/Backlog status unless specified otherwise.",
      },
    };

    // Use the Gemini API integration
    const response = await sendToGemini(message, projectContext);
    return response;
  };

  // Auto-create all AI-generated issues directly in the project
  const handleAutoCreateIssues = async (aiIssues) => {
    if (!aiIssues || aiIssues.length === 0) return;

    let successCount = 0;
    let failureCount = 0;
    for (const aiIssue of aiIssues) {
      try {
        // Resolve status
        let statusId = null;
        if (aiIssue.statusId) {
          statusId = aiIssue.statusId; // Keep as string, don't parse to int
        } else if (aiIssue.status) {
          if (typeof aiIssue.status === "object" && aiIssue.status.id) {
            statusId = aiIssue.status.id; // Keep as string
          } else if (typeof aiIssue.status === "string") {
            const foundStatus = statuses.find(
              (s) => s.name.toLowerCase() === aiIssue.status.toLowerCase()
            );
            statusId = foundStatus ? foundStatus.id : null;
          }
        }

        // Fallback to first TODO status if no status found
        if (!statusId) {
          const todoStatus = statuses.find((s) => s.type === 0);
          statusId = todoStatus ? todoStatus.id : statuses[0]?.id;
        }

        // Resolve epic
        let epicId = null;
        if (aiIssue.epic) {
          const foundEpic = epics.find(
            (e) => (e.name || e.title) === aiIssue.epic
          );
          epicId = foundEpic ? foundEpic.id : null;
        } else if (aiIssue.epicId) {
          epicId = aiIssue.epicId;
        } // Resolve sprint - only assign if explicitly specified
        let sprintId = null;
        if (aiIssue.sprint) {
          // Handle both sprint ID and sprint name
          if (typeof aiIssue.sprint === "string") {
            const foundSprint = sprints.find(
              (s) => s.id === aiIssue.sprint || s.name === aiIssue.sprint
            );
            sprintId = foundSprint ? foundSprint.id : null;
          } else if (typeof aiIssue.sprint === "object" && aiIssue.sprint.id) {
            sprintId = aiIssue.sprint.id;
          }
        } else if (aiIssue.sprintId) {
          sprintId = aiIssue.sprintId;
        }
        // If no sprint is specified, leave sprintId as null (goes to backlog)

        // Create the issue
        const issuePayload = {
          title: aiIssue.title,
          description: aiIssue.description || "",
          storyPoint: aiIssue.storyPoints || aiIssue.storyPoint || 3,
          type: aiIssue.type || "TASK",
          issuePriority: aiIssue.priority || "MEDIUM",
          statusId: statusId,
          assignee: aiIssue.assignee || null,
          epicId: epicId,
          sprintId: sprintId,
        };
        const createdIssue = await createTask(projectId, issuePayload);

        successCount++;
      } catch (error) {
        console.error("Failed to create AI issue:", aiIssue.title, error);
        failureCount++;
      }
    } // Show user feedback
    if (successCount > 0 && failureCount === 0) {
      toast.success(
        `Successfully created ${successCount} issue${
          successCount > 1 ? "s" : ""
        }! Issues are now available on the Board/Backlog.`
      );
    } else if (successCount > 0 && failureCount > 0) {
      toast.success(
        `Created ${successCount} issue${
          successCount > 1 ? "s" : ""
        }, ${failureCount} failed. Created issues are available on the Board/Backlog.`
      );
    } else if (failureCount > 0) {
      toast.error(
        `Failed to create ${failureCount} issue${failureCount > 1 ? "s" : ""}`
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  // Handle clicking on suggested issues for details/editing
  const handleIssueClick = (issue) => {
    setSelectedIssueForDetails(issue);
    setShowIssueDetails(true);
  }; // Handle updating AI-generated issue suggestions
  const handleIssueUpdate = (updatedIssue) => {
    // Update the main suggestedIssues state
    setSuggestedIssues((prev) =>
      prev.map((issue, index) =>
        index === updatedIssue.id ? updatedIssue : issue
      )
    );

    // Also update the selectedIssueForDetails if it's the same issue
    if (
      selectedIssueForDetails &&
      selectedIssueForDetails.id === updatedIssue.id
    ) {
      setSelectedIssueForDetails(updatedIssue);
    }

    toast.success("Issue suggestion updated");
  };

  // Handle confirming selected issues for creation
  const handleConfirmIssues = async (selectedIssues) => {
    await handleAutoCreateIssues(selectedIssues);
    setShowConfirmModal(false);
    setSuggestedIssues([]);
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[50000] p-4">
        <div
          className={`w-full max-w-4xl h-[700px] rounded-2xl shadow-2xl flex flex-col ${
            theme === "dark"
              ? "bg-gray-900 border border-gray-700"
              : "bg-white border border-gray-200"
          } overflow-hidden`}
        >
          {/* Enhanced Header */}
          <div
            className={`flex items-center justify-between p-6 border-b ${
              theme === "dark"
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3
                  className={`font-bold text-lg ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  AI Project Assistant
                </h3>
                {projectData && (
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Helping with: {projectData.name}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-500 transition-colors ${
                theme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Enhanced Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 && (
              <div
                className={`text-center py-12 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h4
                    className={`text-lg font-semibold mb-2 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Welcome to AI Assistant!
                  </h4>
                  <p className="max-w-md mx-auto">
                    I can help you create issues, plan features, and organize
                    your project efficiently.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {[
                    {
                      icon: CheckCircle,
                      text: "Create authentication system",
                      color: "bg-green-100 text-green-600",
                    },
                    {
                      icon: Lightbulb,
                      text: "Plan mobile app features",
                      color: "bg-yellow-100 text-yellow-600",
                    },
                    {
                      icon: AlertCircle,
                      text: "Set up project infrastructure",
                      color: "bg-blue-100 text-blue-600",
                    },
                    {
                      icon: Bot,
                      text: "Generate 10 issues for our team",
                      color: "bg-purple-100 text-purple-600",
                    },
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(suggestion.text)}
                      className={`p-4 rounded-xl border-2 border-dashed ${
                        theme === "dark"
                          ? "border-gray-600 hover:border-gray-500 hover:bg-gray-800"
                          : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                      } transition-all duration-200 text-left group`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg ${suggestion.color} group-hover:scale-110 transition-transform`}
                        >
                          <suggestion.icon className="w-4 h-4" />
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          "{suggestion.text}"
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] flex items-start space-x-3 ${
                    message.role === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "user"
                        ? "bg-blue-600"
                        : "bg-gradient-to-r from-purple-600 to-blue-600"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`p-4 rounded-2xl shadow-sm ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : theme === "dark"
                        ? "bg-gray-800 text-gray-100 border border-gray-700"
                        : "bg-gray-100 text-gray-900 border border-gray-200"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[75%] flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div
                    className={`p-4 rounded-2xl shadow-sm ${
                      theme === "dark"
                        ? "bg-gray-800 border border-gray-700"
                        : "bg-gray-100 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        AI is thinking...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Input Area */}
          <div
            className={`p-6 border-t ${
              theme === "dark"
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Ask me to create issues for ${
                    projectData?.name || "your project"
                  }...`}
                  className={`w-full p-4 pr-12 rounded-xl border-2 resize-none transition-all duration-200 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-gray-600"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-white"
                  } focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20`}
                  rows="1"
                  style={{ minHeight: "56px", maxHeight: "120px" }}
                />
                <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                  Press Enter to send
                </div>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[56px] transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            {/* Status Indicator */}
            <div className="mt-3 flex items-center justify-between text-xs">
              <div
                className={`flex items-center space-x-2 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>AI Assistant is ready</span>
              </div>
              {projectData && (
                <span
                  className={`${
                    theme === "dark" ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Connected to project: {projectData.name}
                </span>
              )}
            </div>{" "}
          </div>
        </div>
        {/* Issue Details Modal for AI suggestions */}
        {showIssueDetails && selectedIssueForDetails && (
          <IssueDetailsModal
            issue={{
              ...selectedIssueForDetails,
              // Transform AI issue data to match expected format
              key: getIssueKey(
                selectedIssueForDetails,
                selectedIssueForDetails.id
              ),
              storyPoint: selectedIssueForDetails.storyPoints,
              type:
                selectedIssueForDetails.type ||
                (selectedIssueForDetails.storyPoints >= 5
                  ? "Story"
                  : selectedIssueForDetails.storyPoints <= 2
                  ? "Bug"
                  : "Task"),
              issuePriority:
                selectedIssueForDetails.issuePriority ||
                selectedIssueForDetails.priority ||
                (selectedIssueForDetails.storyPoints >= 5
                  ? "HIGH"
                  : selectedIssueForDetails.storyPoints >= 3
                  ? "MEDIUM"
                  : "LOW"), // Enhanced status information - find the actual status object
              status: (() => {
                // Try to find status by ID first
                if (selectedIssueForDetails.statusId) {
                  const foundStatus = statuses.find(
                    (s) => s.id === selectedIssueForDetails.statusId
                  );
                  if (foundStatus) return foundStatus;
                }

                // Try to find status by name
                if (selectedIssueForDetails.status) {
                  if (
                    typeof selectedIssueForDetails.status === "object" &&
                    selectedIssueForDetails.status.name
                  ) {
                    return selectedIssueForDetails.status;
                  }

                  if (typeof selectedIssueForDetails.status === "string") {
                    const foundStatus = statuses.find(
                      (s) =>
                        s.name.toLowerCase() ===
                        selectedIssueForDetails.status.toLowerCase()
                    );
                    if (foundStatus) return foundStatus;

                    // Return a temporary status object if not found
                    return { name: selectedIssueForDetails.status, type: 0 };
                  }
                }

                // Default fallback - first TODO status
                return (
                  statuses.find((s) => s.type === 0) || {
                    name: "To Do",
                    type: 0,
                  }
                );
              })(),
              statusId:
                selectedIssueForDetails.statusId ||
                (selectedIssueForDetails.status &&
                typeof selectedIssueForDetails.status === "object"
                  ? selectedIssueForDetails.status.id
                  : statuses.find((s) => s.type === 0)?.id),
              epic: selectedIssueForDetails.epic
                ? epics.find(
                    (e) => (e.name || e.title) === selectedIssueForDetails.epic
                  )
                : null,
              assigneeUser: selectedIssueForDetails.assignee
                ? projectMembers.find(
                    (m) => m.userId === selectedIssueForDetails.assignee
                  )?.user
                : null,
              sprint: selectedIssueForDetails.sprint
                ? sprints.find(
                    (s) =>
                      s.id === selectedIssueForDetails.sprint ||
                      s.name === selectedIssueForDetails.sprint
                  )
                : null,
              createdAt: new Date().toISOString(),
              // Mark as AI-generated for special handling
              isAIGenerated: true,
            }}
            // Special mode for AI-generated issues
            isPreviewMode={true}
            previewModeConfig={{
              title: "AI-Generated Issue (Editable)",
              subtitle:
                "Edit this AI-suggested issue. Changes will be saved to suggestions.",
              hideEditButton: false, // Allow editing
              hideDeleteButton: false,
              customDeleteLabel: "Remove from Suggestions",
              customDeleteMessage: "Remove this issue from the AI suggestions?",
            }}
            // Pass project data for editing
            projectMembers={projectMembers}
            sprints={sprints}
            projectId={projectId}
            epics={epics}
            onClose={() => {
              setShowIssueDetails(false);
              setSelectedIssueForDetails(null);
            }}
            onUpdate={handleIssueUpdate}
            onDelete={() => {
              // Remove issue from suggestedIssues list
              setSuggestedIssues((prev) =>
                prev.filter(
                  (issue, index) => index !== selectedIssueForDetails.id
                )
              );
              setShowIssueDetails(false);
              setSelectedIssueForDetails(null);
              toast.success("Issue removed from suggestions");
            }}
          />
        )}{" "}
        {/* AI Issue Confirmation Modal */}
        {showConfirmModal && suggestedIssues.length > 0 && (
          <IssueConfirmationModal
            issues={suggestedIssues}
            epics={epics}
            projectMembers={projectMembers}
            sprints={sprints}
            statuses={statuses}
            projectId={projectId}
            theme={theme}
            onClose={() => {
              setShowConfirmModal(false);
              setSuggestedIssues([]);
            }}
            onConfirm={handleConfirmIssues}
            onIssueClick={handleIssueClick}
            onIssueUpdate={handleIssueUpdate}
          />
        )}
      </div>
    </Portal>
  );
};

const IssueConfirmationModal = ({
  issues,
  epics,
  projectMembers,
  sprints,
  statuses,
  projectId,
  theme,
  onClose,
  onConfirm,
  onIssueClick,
  onIssueUpdate,
}) => {
  const [editableIssues, setEditableIssues] = useState([]);

  // Initialize issues only once when component mounts or issues prop changes
  useEffect(() => {
    const initializedIssues = issues.map((issue, index) => {
      const initialIssue = {
        ...issue,
        id: index,
        selected: true,
        epic: issue.epic || "",
        assignee: issue.assignee || "",
        sprint: issue.sprint || "",
        storyPoints: issue.storyPoints || 3,
      };
      return initialIssue;
    });
    setEditableIssues(initializedIssues);
  }, [issues]);

  const updateIssue = (id, field, value) => {
    setEditableIssues((prev) => {
      const updated = prev.map((issue) =>
        issue.id === id ? { ...issue, [field]: value } : issue
      );
      return updated;
    });
  };

  const toggleSelection = (id) => {
    setEditableIssues((prev) =>
      prev.map((issue) =>
        issue.id === id ? { ...issue, selected: !issue.selected } : issue
      )
    );
  };

  const handleConfirm = () => {
    const selectedIssues = editableIssues.filter((issue) => issue.selected);
    onConfirm(selectedIssues);
  };
  // Handle issue card click - delegate to parent
  const handleIssueClick = (issue, event) => {
    // Don't open details if clicking on checkbox
    if (event.target.type === "checkbox") {
      return;
    }

    onIssueClick(issue, event);
  };

  const selectedCount = editableIssues.filter((issue) => issue.selected).length;

  return (
    <Portal>
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[60000] p-4">
        <div
          className={`w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col ${
            theme === "dark"
              ? "bg-gray-900 border border-gray-700"
              : "bg-white border border-gray-200"
          } overflow-hidden`}
        >
          {/* Enhanced Header */}
          <div
            className={`flex items-center justify-between p-6 border-b ${
              theme === "dark"
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3
                  className={`text-xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Review AI Suggestions
                </h3>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Customize and approve the issues before creating them
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-500 transition-colors ${
                theme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Enhanced Issues List */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {editableIssues.map((issue) => (
                <div
                  key={issue.id}
                  onClick={(e) => {
                    handleIssueClick(issue, e);
                  }}
                  className={`relative bg-white dark:bg-gradient-card rounded-lg p-2.5 border-l-4 shadow-sm transition-all duration-200 cursor-pointer ${getIssueColor(
                    issue
                  )} ${
                    issue.selected
                      ? "ring-2 ring-blue-500 shadow-lg shadow-blue-500/20 scale-105"
                      : "hover:shadow-md dark:hover:shadow-gray-900/30"
                  } hover:scale-102`}
                >
                  {/* Selection Checkbox Overlay */}
                  <div className="absolute top-1.5 left-1.5 z-10">
                    <input
                      type="checkbox"
                      checked={issue.selected}
                      onChange={() => toggleSelection(issue.id)}
                      className="w-3.5 h-3.5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </div>

                  {/* Issue Card Content - Board Style Layout */}
                  <div className="flex flex-col space-y-1.5 pt-5">
                    {/* Board-style Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 flex items-center justify-center">
                          {getIssueTypeIcon(issue)}
                        </div>
                        <span className="ml-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                          {getIssueKey(issue, issue.id)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {/* Status Indicator */}
                        {issue.status &&
                          (() => {
                            const statusObj = statuses.find(
                              (s) =>
                                s.name.toLowerCase() ===
                                  issue.status.toLowerCase() ||
                                s.id === issue.statusId
                            );
                            const isCompleted =
                              statusObj && statusObj.type === 2; // DONE type

                            if (isCompleted) {
                              return (
                                <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded text-xs font-medium">
                                  ✅ {issue.status}
                                </span>
                              );
                            } else {
                              return (
                                <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded text-xs font-medium">
                                  🔄 {issue.status}
                                </span>
                              );
                            }
                          })()}
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 rounded-full px-1.5 py-0.5 text-gray-600 dark:text-gray-300 font-medium">
                          {issue.storyPoints || 3} pts
                        </span>
                        <div className="ml-0.5">{getPriorityIcon(issue)}</div>
                      </div>
                    </div>
                    {/* Board-style Title */}
                    <div className="mb-1">
                      <h4
                        className={`text-xs font-medium leading-tight ${
                          theme === "dark" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {issue.title}
                      </h4>
                    </div>
                    {/* Board-style Description */}
                    {issue.description && (
                      <div className="mb-2">
                        <p
                          className={`text-xs leading-tight line-clamp-2 ${
                            theme === "dark" ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {issue.description}
                        </p>
                      </div>
                    )}
                    {/* Board-style Footer */}
                    <div className="space-y-1.5">
                      {" "}
                      {/* Epic Display */}
                      {issue.epic && (
                        <div className="flex items-center">
                          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded text-xs font-medium">
                            🔖 {issue.epic.name || issue.epic}
                          </span>
                        </div>
                      )}
                      {/* Assignee and Sprint Row */}
                      <div className="flex items-center justify-between text-xs">
                        {/* Assignee */}
                        <div className="flex items-center">
                          {issue.assignee ? (
                            <div className="flex items-center">
                              <div className="w-5 h-5 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                                {projectMembers
                                  .find((m) => m.userId === issue.assignee)
                                  ?.user?.fullName?.charAt(0)
                                  ?.toUpperCase() || "?"}
                              </div>
                              <span className="ml-1 text-gray-600 dark:text-gray-400 truncate max-w-[60px]">
                                {projectMembers
                                  .find((m) => m.userId === issue.assignee)
                                  ?.user?.fullName?.split(" ")[0] || "User"}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-500">
                              Unassigned
                            </span>
                          )}
                        </div>

                        {/* Sprint */}
                        {issue.sprint && (
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded text-xs font-medium">
                            🏃{" "}
                            {sprints.find((s) => s.id === issue.sprint)?.name ||
                              "Sprint"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Footer */}
          <div
            className={`flex items-center justify-between p-6 border-t ${
              theme === "dark"
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center space-x-2 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">
                  {selectedCount} of {editableIssues.length} issues selected
                </span>
              </div>
              {selectedCount > 0 && (
                <div
                  className={`text-xs px-3 py-1 rounded-full ${
                    theme === "dark"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  Ready to create
                </div>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className={`px-6 py-3 border-2 rounded-xl font-medium transition-all duration-200 ${
                  theme === "dark"
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={selectedCount === 0}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                Create {selectedCount} Issue{selectedCount !== 1 ? "s" : ""}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default AIChatAssistant;
