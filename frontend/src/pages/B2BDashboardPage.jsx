import { useEffect, useMemo, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import AppShell from "../components/layout/AppShell";
import StatCard from "../components/layout/StatCard";
import { b2bSummaryCards, b2bUsageDaily } from "../data/mockData";
import { getB2BDashboard } from "../services/api";

export default function B2BDashboardPage() {
  const [range, setRange] = useState(7);
  const [cards, setCards] = useState(b2bSummaryCards);
  const [usage, setUsage] = useState(b2bUsageDaily);
  const data = useMemo(() => usage.slice(-range), [range, usage]);

  useEffect(() => {
    getB2BDashboard()
      .then((result) => {
        setCards(result.cards || b2bSummaryCards);
        setUsage(result.usage || b2bUsageDaily);
      })
      .catch(() => {});
  }, []);

  return (
    <AppShell portal="b2b" title="B2B User Dashboard Components">
      <div className="card-grid four">
        {cards.map((card) => (
          <StatCard key={card.title} title={card.title} value={card.value} hint="Updated just now" />
        ))}
      </div>

      <section className="panel">
        <div className="panel-title-row">
          <h3>Usage Chart (Recharts Line Chart)</h3>
          <div className="inline-buttons">
            <button type="button" className={range === 7 ? "active-btn" : ""} onClick={() => setRange(7)}>
              Last 7 Days
            </button>
            <button type="button" className={range === 30 ? "active-btn" : ""} onClick={() => setRange(30)}>
              Last 30 Days
            </button>
          </div>
        </div>

        <p className="panel-copy">X-axis: Day | Y-axis: Request count | Tooltip: exact count per day | Color-coded by endpoint type</p>

        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="search" stroke="#0ea5a4" strokeWidth={2.5} />
              <Line type="monotone" dataKey="villages" stroke="#f97316" strokeWidth={2.5} />
              <Line type="monotone" dataKey="states" stroke="#0284c7" strokeWidth={2.5} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </AppShell>
  );
}
