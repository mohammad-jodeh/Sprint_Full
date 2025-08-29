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
import CustomTooltip from "./CustomTooltip";

const COLORS = [
  "#00BC7D",
  "#FE9900",
  "#FF1F57",
  "#007AFF",
  "#8884d8",
  "#82ca9d",
];

const CustomBarChart = ({ data = [] }) => {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 40, left: 20, bottom: 10 }}
        barCategoryGap={40}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          strokeOpacity={0.1}
        />
        <XAxis
          dataKey="project"
          tick={{ fill: "#888", fontSize: 12 }}
          stroke="transparent"
        />
        <YAxis tick={{ fill: "#888", fontSize: 12 }} stroke="transparent" />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
        <Bar dataKey="issues" radius={[6, 6, 0, 0]} barSize={60}>
          {data.map((entry, index) => (
            <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomBarChart;
