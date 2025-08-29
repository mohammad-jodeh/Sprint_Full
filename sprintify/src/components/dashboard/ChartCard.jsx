export default function ChartCard({ title, children }) {
  return (
    <div className="bg-white dark:bg-gradient-card rounded-xl shadow p-6 border border-gray-100 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        {title}
      </h2>
      {children}
    </div>
  );
}
