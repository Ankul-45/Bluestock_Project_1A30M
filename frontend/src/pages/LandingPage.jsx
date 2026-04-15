import { Link } from "react-router-dom";

const modules = [
  {
    title: "Admin Analytics",
    description: "Real-time metrics, request trends, plan distribution, endpoint behavior and hour-wise heat map.",
    path: "/admin/analytics",
  },
  {
    title: "User Management",
    description: "Search, filter, bulk approvals, user detail view, API key status, and approval workflow support.",
    path: "/admin/users",
  },
  {
    title: "Village Master Browser",
    description: "State -> District -> Sub-district dependent filters with pagination and searchable records.",
    path: "/admin/villages",
  },
  {
    title: "B2B Registration + Dashboard",
    description: "Business sign-up with approval model and developer usage monitoring dashboard.",
    path: "/b2b/register",
  },
];

export default function LandingPage() {
  return (
    <div className="landing">
      <header className="hero">
        <p className="eyebrow">Production-grade SaaS Frontend</p>
        <h1>India Location API Platform UI</h1>
        <p>
          Frontend implementation for admin and B2B client workflows including analytics, data browsing,
          access control, and API key operations.
        </p>
      </header>

      <section className="module-grid">
        {modules.map((module) => (
          <article key={module.title} className="module-card">
            <h3>{module.title}</h3>
            <p>{module.description}</p>
            <Link to={module.path} className="button">
              Open Module
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
