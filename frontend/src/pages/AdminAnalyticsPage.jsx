import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AppShell from "../components/layout/AppShell";
import StatCard from "../components/layout/StatCard";
import HeatGrid from "../components/charts/HeatGrid";
import { getAdminAnalytics } from "../services/api";
import {
  adminMetrics,
  endpointUsage,
  hourlyHeatMap,
  planDistribution,
  requestTrend30Days,
  responseTimeTrend,
  topStatesByVillageCount,
} from "../data/mockData";

const pieColors = ["#0ea5a4", "#f97316", "#0284c7", "#16a34a"];

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    metrics: adminMetrics,
    topStatesByVillageCount,
    requestTrend30Days,
    planDistribution,
    responseTimeTrend,
    endpointUsage,
    hourlyHeatMap,
  });

  useEffect(() => {
    let active = true;
    getAdminAnalytics()
      .then((payload) => {
        if (!active) return;
        setAnalytics(payload);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return (
    <AppShell portal="admin" title="Dashboard Analytics Visualizations">
      <div className="card-grid five">
        {analytics.metrics.map((metric) => (
          <StatCard key={metric.title} title={metric.title} value={metric.value} hint={metric.change} trend={metric.trend} />
        ))}
      </div>

      <div className="chart-grid">
        <article className="panel">
          <h3>Top 10 States by Village Count</h3>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={analytics.topStatesByVillageCount}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="state" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="villages" fill="#0ea5a4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel">
          <h3>API Requests Over Last 30 Days</h3>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={analytics.requestTrend30Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" interval={4} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="requests" stroke="#f97316" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel">
          <h3>User Distribution by Plan Type</h3>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={analytics.planDistribution} dataKey="users" nameKey="plan" outerRadius={92} label>
                  {analytics.planDistribution.map((entry, index) => (
                    <Cell key={entry.plan} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel">
          <h3>Response Time Trend (p95, p99)</h3>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={analytics.responseTimeTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" interval={3} />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="p95" stroke="#0284c7" fill="#bae6fd" />
                <Area type="monotone" dataKey="p99" stroke="#dc2626" fill="#fecaca" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel">
          <h3>Daily Requests by Endpoint</h3>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={analytics.endpointUsage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="search" stackId="a" fill="#0ea5a4" />
                <Bar dataKey="villages" stackId="a" fill="#f97316" />
                <Bar dataKey="states" stackId="a" fill="#0284c7" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel">
          <h3>Usage by Hour of Day</h3>
          <p className="panel-copy">Heat map style summary with real-time intensity</p>
          <HeatGrid data={analytics.hourlyHeatMap} />
        </article>
      </div>
    </AppShell>
  );
}
