const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "india_location_db",
  password: "your_password",
  port: 5432,
});

// 🔐 Auth Middleware
const checkAuth = async (req, res, next) => {
  try {
    const key = req.headers["x-api-key"];
    const secret = req.headers["x-api-secret"];

    const result = await pool.query(
      "SELECT * FROM api_keys WHERE api_key=$1 AND api_secret=$2",
      [key, secret]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: "Auth error" });
  }
};

// 📍 Get states
app.get("/states", checkAuth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name FROM states ORDER BY name"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 📍 Get districts
app.get("/states/:state_id/districts", checkAuth, async (req, res) => {
  try {
    const { state_id } = req.params;

    const result = await pool.query(
      "SELECT id, name FROM districts WHERE state_id=$1 ORDER BY name",
      [state_id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 📍 Get subdistricts
app.get("/districts/:district_id/subdistricts", checkAuth, async (req, res) => {
  try {
    const { district_id } = req.params;

    const result = await pool.query(
      "SELECT id, name FROM sub_districts WHERE district_id=$1 ORDER BY name",
      [district_id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 📍 Get villages (with pagination)
app.get("/subdistricts/:id/villages", checkAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      "SELECT id, name FROM villages WHERE sub_district_id=$1 ORDER BY name LIMIT $2 OFFSET $3",
      [id, limit, offset]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 🔍 Search API
app.get("/search", checkAuth, async (req, res) => {
  try {
    const q = req.query.q;

    if (!q) {
      return res.status(400).json({ error: "Query parameter required" });
    }

    const result = await pool.query(
      `
      SELECT v.name as village, sd.name as subdistrict, d.name as district, s.name as state
      FROM villages v
      JOIN sub_districts sd ON v.sub_district_id = sd.id
      JOIN districts d ON sd.district_id = d.id
      JOIN states s ON d.state_id = s.id
      WHERE v.name ILIKE $1
      LIMIT 20
      `,
      [`%${q}%`]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 🚀 Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});