export default function StatCard({ title, value, hint, trend = "neutral" }) {
  return (
    <article className="stat-card">
      <p className="stat-title">{title}</p>
      <h3>{value}</h3>
      <p className={`stat-hint ${trend}`}>{hint}</p>
    </article>
  );
}
