const crypto = require("crypto");
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT || 5000);

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "india_location_db",
  password: process.env.DB_PASSWORD || "your_password",
  port: Number(process.env.DB_PORT || 5432),
});

const dashboardTrend = Array.from({ length: 30 }).map((_, index) => ({
  day: index + 1,
  search: 650 + Math.round(Math.sin(index / 2) * 130 + 180),
  villages: 420 + Math.round(Math.cos(index / 4) * 95 + 120),
  states: 120 + Math.round(Math.sin(index / 5) * 40 + 45),
}));

let adminUsers = [
  {
    id: "U-1001",
    businessEmail: "ops@rapidlogix.com",
    businessName: "Rapid Logix Pvt Ltd",
    status: "Pending",
    plan: "Premium",
    registrationDate: "2026-04-08",
    lastActive: "2026-04-14",
    requestCount: 24389,
    phone: "+91 9811122233",
    gst: "27AAECR1138A1Z4",
    statesAllowed: ["Maharashtra", "Karnataka"],
    keys: 2,
    notes: [],
  },
  {
    id: "U-1002",
    businessEmail: "tech@gramgrid.in",
    businessName: "GramGrid Analytics",
    status: "Active",
    plan: "Pro",
    registrationDate: "2026-03-21",
    lastActive: "2026-04-15",
    requestCount: 81234,
    phone: "+91 9919988877",
    gst: "29ABBCG9384R1Z9",
    statesAllowed: ["All India"],
    keys: 3,
    notes: [],
  },
  {
    id: "U-1003",
    businessEmail: "api@kartdispatch.com",
    businessName: "Kart Dispatch",
    status: "Suspended",
    plan: "Free",
    registrationDate: "2026-02-11",
    lastActive: "2026-04-10",
    requestCount: 5230,
    phone: "+91 9000022233",
    gst: "-",
    statesAllowed: ["Tamil Nadu", "Karnataka"],
    keys: 1,
    notes: [],
  },
  {
    id: "U-1004",
    businessEmail: "product@northroute.ai",
    businessName: "NorthRoute AI",
    status: "Active",
    plan: "Unlimited",
    registrationDate: "2026-01-15",
    lastActive: "2026-04-15",
    requestCount: 178100,
    phone: "+91 9777711111",
    gst: "07AAVFN1122B1ZA",
    statesAllowed: ["Delhi", "UP", "Haryana", "Punjab"],
    keys: 5,
    notes: [],
  },
];

let stateAccessAudit = [
  {
    date: "2026-04-15 10:21",
    admin: "admin@bluestock.in",
    action: "Granted all-state access",
    target: "U-1002",
  },
  {
    date: "2026-04-14 18:43",
    admin: "admin@bluestock.in",
    action: "Revoked Telangana",
    target: "U-1004",
  },
  {
    date: "2026-04-14 11:04",
    admin: "lead@bluestock.in",
    action: "Granted South region",
    target: "U-1001",
  },
];

const apiKeyInventory = {
  "U-1002": [
    {
      id: "KEY-1",
      key: "bk_live_2h8f....nQ3a",
      createdAt: "2026-03-01",
      lastUsedAt: "2026-04-15",
      status: "Active",
    },
    {
      id: "KEY-2",
      key: "bk_live_8m2k....mR1d",
      createdAt: "2026-01-10",
      lastUsedAt: "2026-04-12",
      status: "Active",
    },
  ],
};

function toSafeInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function findUser(userId) {
  return adminUsers.find((user) => user.id === userId);
}

function ensureKeyBucket(userId) {
  if (!apiKeyInventory[userId]) apiKeyInventory[userId] = [];
  return apiKeyInventory[userId];
}

function createMaskedApiKey() {
  const raw = crypto.randomBytes(8).toString("hex");
  return `bk_live_${raw.slice(0, 4)}....${raw.slice(-4)}`;
}

// API key auth middleware
const checkAuth = async (req, res, next) => {
  try {
    const key = req.headers["x-api-key"];
    const secret = req.headers["x-api-secret"];

    if (!key || !secret) {
      return res.status(401).json({ error: "Missing API credentials" });
    }

    const result = await pool.query("SELECT 1 FROM api_keys WHERE api_key=$1 AND api_secret=$2", [key, secret]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    return next();
  } catch (err) {
    return res.status(500).json({ error: "Auth error", detail: err.message });
  }
};

app.get("/health", (_, res) => {
  res.json({ ok: true, service: "india-location-api", now: new Date().toISOString() });
});

// Geography APIs
app.get("/states", checkAuth, async (_, res) => {
  try {
    const result = await pool.query("SELECT id, name FROM states ORDER BY name");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error", detail: err.message });
  }
});

app.get("/states/:state_id/districts", checkAuth, async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name FROM districts WHERE state_id=$1 ORDER BY name", [req.params.state_id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error", detail: err.message });
  }
});

app.get("/districts/:district_id/subdistricts", checkAuth, async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name FROM sub_districts WHERE district_id=$1 ORDER BY name", [
      req.params.district_id,
    ]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error", detail: err.message });
  }
});

app.get("/subdistricts/:id/villages", checkAuth, async (req, res) => {
  try {
    const page = Math.max(1, toSafeInt(req.query.page, 1));
    const limit = Math.min(10000, Math.max(1, toSafeInt(req.query.limit, 50)));
    const offset = (page - 1) * limit;

    const result = await pool.query(
      "SELECT id, code, name FROM villages WHERE sub_district_id=$1 ORDER BY name LIMIT $2 OFFSET $3",
      [req.params.id, limit, offset],
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error", detail: err.message });
  }
});

app.get("/search", checkAuth, async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: "Query parameter required" });

    const result = await pool.query(
      `
      SELECT v.name AS village, sd.name AS subdistrict, d.name AS district, s.name AS state
      FROM villages v
      JOIN sub_districts sd ON v.sub_district_id = sd.id
      JOIN districts d ON sd.district_id = d.id
      JOIN states s ON d.state_id = s.id
      WHERE v.name ILIKE $1
      ORDER BY v.name
      LIMIT 20
      `,
      [`%${q}%`],
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error", detail: err.message });
  }
});

// Admin APIs
app.get("/admin/analytics", checkAuth, async (_, res) => {
  try {
    const villageCountResult = await pool.query("SELECT COUNT(*)::int AS total FROM villages");
    const totalVillages = villageCountResult.rows[0]?.total || 0;

    res.json({
      metrics: [
        { title: "Total Villages", value: totalVillages.toLocaleString(), change: "+2.4%", trend: "up" },
        { title: "Active Users", value: "4,281", change: "+8.1%", trend: "up" },
        { title: "Today's API Requests", value: "1,92,430", change: "+5.8%", trend: "up" },
        { title: "Avg Response Time", value: "83 ms", change: "SLA: <100 ms", trend: "neutral" },
        { title: "Total Revenue", value: "INR 18.7L", change: "+12.2%", trend: "up" },
      ],
      topStatesByVillageCount: [
        { state: "UP", villages: 10231 },
        { state: "Bihar", villages: 9410 },
        { state: "MP", villages: 9085 },
        { state: "Maharashtra", villages: 8454 },
        { state: "Rajasthan", villages: 8120 },
        { state: "Odisha", villages: 7841 },
        { state: "Karnataka", villages: 7262 },
        { state: "Tamil Nadu", villages: 7020 },
        { state: "Gujarat", villages: 6748 },
        { state: "Assam", villages: 6412 },
      ],
      requestTrend30Days: Array.from({ length: 30 }).map((_, index) => ({
        day: `D${index + 1}`,
        requests: 120000 + Math.round(Math.sin(index / 3) * 15000) + index * 400,
      })),
      planDistribution: [
        { plan: "Free", users: 1034 },
        { plan: "Premium", users: 1902 },
        { plan: "Pro", users: 1088 },
        { plan: "Unlimited", users: 257 },
      ],
      responseTimeTrend: Array.from({ length: 24 }).map((_, index) => ({
        hour: `${index}:00`,
        p95: 70 + Math.round(Math.sin(index / 2) * 12) + (index % 4),
        p99: 94 + Math.round(Math.cos(index / 3) * 16) + (index % 5),
      })),
      endpointUsage: [
        { day: "Mon", search: 15200, villages: 10300, states: 4100 },
        { day: "Tue", search: 17100, villages: 11200, states: 4300 },
        { day: "Wed", search: 16650, villages: 10890, states: 4210 },
        { day: "Thu", search: 18500, villages: 12120, states: 4680 },
        { day: "Fri", search: 19840, villages: 13011, states: 4900 },
        { day: "Sat", search: 14220, villages: 10110, states: 3880 },
        { day: "Sun", search: 12610, villages: 9260, states: 3520 },
      ],
      hourlyHeatMap: [
        { slot: "00-03", traffic: 22 },
        { slot: "03-06", traffic: 15 },
        { slot: "06-09", traffic: 42 },
        { slot: "09-12", traffic: 78 },
        { slot: "12-15", traffic: 86 },
        { slot: "15-18", traffic: 74 },
        { slot: "18-21", traffic: 69 },
        { slot: "21-24", traffic: 48 },
      ],
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", detail: err.message });
  }
});

app.get("/admin/users", checkAuth, (req, res) => {
  const search = (req.query.search || "").toString().toLowerCase().trim();
  const status = req.query.status || "All";
  const plan = req.query.plan || "All";
  const sortBy = req.query.sortBy || "registrationDate";

  const result = adminUsers
    .filter((user) => {
      const matchSearch =
        user.businessEmail.toLowerCase().includes(search) ||
        user.businessName.toLowerCase().includes(search) ||
        user.id.toLowerCase().includes(search);
      const matchStatus = status === "All" || user.status === status;
      const matchPlan = plan === "All" || user.plan === plan;
      return matchSearch && matchStatus && matchPlan;
    })
    .sort((a, b) => {
      if (sortBy === "requestCount") return b.requestCount - a.requestCount;
      return String(b[sortBy]).localeCompare(String(a[sortBy]));
    });

  res.json(result);
});

app.patch("/admin/users/:userId/status", checkAuth, (req, res) => {
  const user = findUser(req.params.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const nextStatus = req.body?.status;
  if (!["Pending", "Active", "Suspended"].includes(nextStatus)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  user.status = nextStatus;
  user.lastActive = new Date().toISOString().slice(0, 10);
  stateAccessAudit.unshift({
    date: new Date().toISOString().replace("T", " ").slice(0, 16),
    admin: "admin@bluestock.in",
    action: `Updated status to ${nextStatus}`,
    target: user.id,
  });
  res.json({ ok: true, user });
});

app.post("/admin/users/:userId/notes", checkAuth, (req, res) => {
  const user = findUser(req.params.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const note = (req.body?.note || "").toString().trim();
  if (!note) return res.status(400).json({ error: "Note is required" });
  user.notes.unshift({
    at: new Date().toISOString(),
    by: "admin@bluestock.in",
    note,
  });
  res.json({ ok: true, notes: user.notes });
});

app.post("/admin/users/:userId/state-access", checkAuth, (req, res) => {
  const user = findUser(req.params.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const mode = req.body?.mode || "all";
  const region = req.body?.region || "";
  const states = Array.isArray(req.body?.states) ? req.body.states : [];

  if (mode === "all") user.statesAllowed = ["All India"];
  if (mode === "region") user.statesAllowed = [`${region} Region`];
  if (mode === "specific") user.statesAllowed = states;

  stateAccessAudit.unshift({
    date: new Date().toISOString().replace("T", " ").slice(0, 16),
    admin: "admin@bluestock.in",
    action: `Applied ${mode} access policy`,
    target: user.id,
  });

  res.json({ ok: true, user });
});

app.get("/admin/state-access/audit", checkAuth, (_, res) => {
  res.json(stateAccessAudit.slice(0, 50));
});

app.get("/admin/villages", checkAuth, async (req, res) => {
  try {
    const stateId = req.query.state_id;
    const districtId = req.query.district_id;
    const subDistrictId = req.query.sub_district_id;
    const search = (req.query.search || "").toString().trim();
    const page = Math.max(1, toSafeInt(req.query.page, 1));
    const limit = Math.min(10000, Math.max(1, toSafeInt(req.query.limit, 500)));
    const offset = (page - 1) * limit;

    const params = [];
    const filters = [];
    const fromBlock = `
      FROM villages v
      JOIN sub_districts sd ON v.sub_district_id = sd.id
      JOIN districts d ON sd.district_id = d.id
      JOIN states s ON d.state_id = s.id
    `;

    if (stateId) {
      params.push(stateId);
      filters.push(`s.id = $${params.length}`);
    }
    if (districtId) {
      params.push(districtId);
      filters.push(`d.id = $${params.length}`);
    }
    if (subDistrictId) {
      params.push(subDistrictId);
      filters.push(`sd.id = $${params.length}`);
    }
    if (search) {
      params.push(`%${search}%`);
      filters.push(`v.name ILIKE $${params.length}`);
    }

    const whereSql = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
    const countQuery = `SELECT COUNT(*)::int AS total ${fromBlock} ${whereSql}`;
    const countResult = await pool.query(countQuery, params);

    const dataParams = [...params, limit, offset];
    const dataQuery = `
      SELECT
        s.name AS state_name,
        d.name AS district_name,
        sd.name AS sub_district_name,
        v.code AS village_code,
        v.name AS village_name
      ${fromBlock}
      ${whereSql}
      ORDER BY s.name, d.name, sd.name, v.name
      LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}
    `;
    const rowsResult = await pool.query(dataQuery, dataParams);

    res.json({
      rows: rowsResult.rows,
      total: countResult.rows[0]?.total || 0,
      page,
      limit,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", detail: err.message });
  }
});

// B2B APIs
app.post("/b2b/register", (req, res) => {
  const { businessEmail, businessName, gstNumber, phoneNumber } = req.body || {};
  if (!businessEmail || !businessName || !phoneNumber) {
    return res.status(400).json({ error: "businessEmail, businessName and phoneNumber are required" });
  }

  const nextId = `U-${1000 + adminUsers.length + 1}`;
  const createdUser = {
    id: nextId,
    businessEmail,
    businessName,
    status: "Pending",
    plan: "Free",
    registrationDate: new Date().toISOString().slice(0, 10),
    lastActive: new Date().toISOString().slice(0, 10),
    requestCount: 0,
    phone: phoneNumber,
    gst: gstNumber || "-",
    statesAllowed: [],
    keys: 0,
    notes: [],
  };
  adminUsers.unshift(createdUser);
  return res.status(201).json({
    ok: true,
    message: "Registration submitted. Status: PENDING_APPROVAL",
    user: createdUser,
  });
});

app.get("/b2b/dashboard/:userId", checkAuth, (req, res) => {
  const user = findUser(req.params.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({
    cards: [
      { title: "Today's Requests / Daily Limit", value: "8,420 / 20,000" },
      { title: "This Month's Requests", value: "2,21,480" },
      { title: "Avg Response Time (24h)", value: "88 ms" },
      { title: "Success Rate", value: "99.73%" },
    ],
    usage: dashboardTrend,
  });
});

app.get("/b2b/keys/:userId", checkAuth, (req, res) => {
  const user = findUser(req.params.userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  const keys = ensureKeyBucket(user.id);
  res.json(keys);
});

app.post("/b2b/keys/:userId", checkAuth, (req, res) => {
  const user = findUser(req.params.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const keys = ensureKeyBucket(user.id);
  const action = req.body?.action;
  const keyId = req.body?.keyId;

  if (action === "create") {
    const newKey = {
      id: `KEY-${keys.length + 1}`,
      key: createMaskedApiKey(),
      createdAt: new Date().toISOString().slice(0, 10),
      lastUsedAt: "-",
      status: "Active",
    };
    keys.unshift(newKey);
    user.keys = keys.filter((item) => item.status === "Active").length;
    return res.status(201).json({ ok: true, keys });
  }

  const key = keys.find((item) => item.id === keyId);
  if (!key) return res.status(404).json({ error: "Key not found" });

  if (action === "rotate") {
    key.key = createMaskedApiKey();
    key.createdAt = new Date().toISOString().slice(0, 10);
    key.status = "Active";
    return res.json({ ok: true, keys });
  }

  if (action === "revoke") {
    key.status = "Revoked";
    user.keys = keys.filter((item) => item.status === "Active").length;
    return res.json({ ok: true, keys });
  }

  return res.status(400).json({ error: "Unsupported key action" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
