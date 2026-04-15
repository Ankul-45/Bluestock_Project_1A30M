import { Link, NavLink } from "react-router-dom";
import { Building2, Database, KeyRound, LayoutDashboard, ShieldCheck, Users } from "lucide-react";

const adminNav = [
  { to: "/admin/analytics", label: "Analytics", icon: LayoutDashboard },
  { to: "/admin/users", label: "User Management", icon: Users },
  { to: "/admin/access", label: "State Access", icon: ShieldCheck },
  { to: "/admin/villages", label: "Village Browser", icon: Database },
];

const b2bNav = [
  { to: "/b2b/register", label: "Self Registration", icon: Building2 },
  { to: "/b2b/dashboard", label: "Usage Dashboard", icon: LayoutDashboard },
  { to: "/b2b/keys", label: "API Keys", icon: KeyRound },
];

export default function AppShell({ portal, title, children }) {
  const navItems = portal === "admin" ? adminNav : b2bNav;

  return (
    <div className="shell">
      <aside className="sidebar">
        <Link className="brand" to="/">
          <span className="brand-accent">Bluestock</span>
          <span>GeoSaaS</span>
        </Link>
        <p className="sidebar-caption">{portal === "admin" ? "Admin Portal" : "B2B Portal"}</p>
        <nav>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `side-link${isActive ? " active" : ""}`}>
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <h1>{title}</h1>
          <div className="topbar-right">
            <span className="chip">{portal === "admin" ? "Operations Console" : "Developer Console"}</span>
          </div>
        </header>
        <section className="page-content">{children}</section>
      </main>
    </div>
  );
}
