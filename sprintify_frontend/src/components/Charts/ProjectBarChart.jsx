import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = [
  "#00BC7D",
  "#FE9900",
  "#FF1F57",
  "#007AFF",
  "#8884d8",
  "#82ca9d",
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;
  const data = payload[0].payload;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 shadow-xl text-sm space-y-1 backdrop-blur-sm">
      {data.project && (
        <p className="font-semibold text-indigo-600 dark:text-indigo-400">
          {data.project}
        </p>
      )}
      <p className="text-gray-700 dark:text-gray-300">
        Assigned Issues:
        <span className="ml-1 font-bold text-gray-900 dark:text-white">
          {data.issues}
        </span>
      </p>
    </div>
  );
};

const ProjectBarChart = ({ data = [] }) => {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-xl p-4">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 40, left: 20, bottom: 40 }}
          barCategoryGap={36}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            strokeOpacity={0.1}
          />
          <XAxis
            dataKey="project"
            interval={0}
            tick={{
              fill: "#94a3b8",
              fontSize: 13,
              fontWeight: 500,
              fontFamily: "Inter, sans-serif",
            }}
            stroke="transparent"
          />
          <YAxis
            tick={{
              fill: "#94a3b8",
              fontSize: 13,
              fontWeight: 500,
              fontFamily: "Inter, sans-serif",
            }}
            stroke="transparent"
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "transparent" }}
          />
          <Bar dataKey="issues" radius={[10, 10, 0, 0]} barSize={50}>
            {data.map((entry, index) => (
              <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjectBarChart;
