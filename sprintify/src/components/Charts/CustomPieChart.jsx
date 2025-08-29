import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import CustomLegend from "./CustomLegend";
import CustomTooltip from "./CustomTooltip";

const COLORS = [
  "#00BC7D",
  "#FE9900",
  "#FF1F57",
  "#007AFF",
  "#8884d8",
  "#82ca9d",
];

const CustomPieChart = ({ data = [] }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
        <Legend content={<CustomLegend />} verticalAlign="bottom" />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
