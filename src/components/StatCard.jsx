export default function StatCard({ title, value, badge }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-primary">
      <div className="flex justify-between mb-3">
        <h3 className="text-lg font-semibold text-dark">{title}</h3>
        {badge && (
          <span className="bg-primary text-dark text-xs font-bold px-3 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-dark">{value}</p>
    </div>
  );
}
