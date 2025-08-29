import { useEffect, useState, useCallback, useMemo } from "react";
import useAuthStore from "../store/authstore";
import { CircleDot, Hourglass, CheckCircle } from "lucide-react";

import StatusCard from "../components/tasks/StatusCard";
import ProgressBar from "../components/tasks/ProgressBar";
import TaskCard from "../components/tasks/TaskCard";
import { fetchIssueByUserId } from "../api/issues";

export default function TasksPage() {
  const { user, currentProjectId } = useAuthStore();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [greeting, setGreeting] = useState("Welcome");

  // fetch tasks for current user when project or user changes
  const fetchTasks = useCallback(async () => {
    if (!currentProjectId || !user?.id) return;
    setLoading(true);
    try {
      const issues = await fetchIssueByUserId(currentProjectId, user.id);
      setTasks(issues);
    } catch (err) {
      console.error("Failed to load user issues:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [currentProjectId, user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning ☀️");
    else if (hour < 18) setGreeting("Good afternoon 🌤️");
    else setGreeting("Good evening 🌙");
  }, []);

  const handleTaskUpdate = (updatedTask) => {
    // Refresh the tasks list after an update
    fetchTasks();
  };

  // compute status counts and story point progress
  const statusCounts = useMemo(() => {
    const counts = { todo: 0, inProgress: 0, done: 0 };
    tasks.forEach((task) => {
      if (task.statusId === 1) counts.todo++;
      else if (task.statusId === 2) counts.inProgress++;
      else if (task.statusId === 3) counts.done++;
    });
    return counts;
  }, [tasks]);

  const totalPoints = useMemo(
    () => tasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0),
    [tasks]
  );
  const completedPoints = useMemo(
    () =>
      tasks
        .filter((t) => t.statusId === 3)
        .reduce((sum, t) => sum + (t.storyPoints || 0), 0),
    [tasks]
  );

  return (
    <div className="space-y-10">
      {/* Greeting */}
      <div>
        {" "}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {greeting}, {user?.fullName || "User"} 👋
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Here’s a summary of your current Issues
        </p>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatusCard
          label="To Do"
          value={statusCounts.todo}
          icon={<CircleDot className="text-yellow-500" />}
        />
        <StatusCard
          label="In Progress"
          value={statusCounts.inProgress}
          icon={<Hourglass className="text-blue-500" />}
        />
        <StatusCard
          label="Done"
          value={statusCounts.done}
          icon={<CheckCircle className="text-green-500" />}
        />
      </div>

      {/* Progress */}
      <Card title="Story Points Progress">
        <ProgressBar
          completedPoints={completedPoints}
          totalPoints={totalPoints}
        />
      </Card>

      {/* iSSE List */}
      <Card title="My Issues" footer={`${tasks.length} total`}>
        <ul className="space-y-4">
          {loading ? (
            <li className="text-gray-400">Loading...</li>
          ) : tasks.length === 0 ? (
            <li className="text-gray-500 dark:text-gray-400">
              You have no tasks assigned.
            </li>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} onUpdate={handleTaskUpdate} />
            ))
          )}
        </ul>
      </Card>
    </div>
  );
}

function Card({ title, children, footer }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          {title}
        </h2>
        {footer && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {footer}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
