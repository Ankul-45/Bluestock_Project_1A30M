# 🚀 India Location API System (Node.js + PostgreSQL)

🚀 Built a production-style backend system with database design, secure APIs, and optimized search for large-scale location data.

---

## 📌 Overview

This project is a scalable backend system that provides structured access to India’s location data:

* States
* Districts
* Subdistricts
* Villages

It simulates a real-world SaaS API used in:

* Address forms
* Logistics platforms
* KYC verification systems

---

## 👨‍💻 My Contribution

* Designed and implemented PostgreSQL database schema
* Built REST API using Node.js (Express)
* Implemented search using SQL JOINs
* Added API key-based authentication
* Implemented pagination for large datasets
* Optimized queries using indexing

---

## 🗄️ Database Design (PostgreSQL)

Tables:

* `states`
* `districts`
* `sub_districts`
* `villages`
* `api_keys`

Features:

* Normalized relational schema
* Foreign key relationships
* Efficient handling of large datasets

---

## ⚙️ Backend API (Node.js)

### Endpoints

* `GET /states`
* `GET /states/{id}/districts`
* `GET /districts/{id}/subdistricts`
* `GET /subdistricts/{id}/villages?page=1&limit=50`
* `GET /search?q=keyword`

---

## 🔐 API Authentication

All endpoints are secured using API keys.

### Required Headers:

```
x-api-key: test123
x-api-secret: secret123
```

---

## 🔍 Search System

* Search villages using keyword
* Uses SQL JOIN across multiple tables
* Case-insensitive matching

### Example:

```
/search?q=pune
```

---

## ⚡ Features

* Scalable relational database design
* Secure API access using API keys
* Fast search using SQL joins
* Pagination support for large data
* Clean REST API architecture

---

## 🛠️ Setup Instructions

### 1. Create Database

```sql
CREATE DATABASE india_location_db;
```

---

### 2. Run Schema

```bash
psql -d india_location_db -f schema.sql
```

---

### 3. Insert API Key (IMPORTANT)

```sql
INSERT INTO api_keys (api_key, api_secret)
VALUES ('test123', 'secret123');
```

---

### 4. Load Data

```bash
python data.py
```

---

### 5. Install Dependencies

```bash
npm install
```

---

### 6. Configure Database

Open `index.js` and update:

```js
password: "your_password"
```

---

### 7. Run Server

```bash
node index.js
```

Server runs at:

```
http://localhost:5000
```

---

## 🧪 Testing

Use tools like Postman or browser.

Example:

```
GET http://localhost:5000/states
```

(Add headers for authentication)

---

## 🧠 Tech Stack

* Node.js (Express)
* PostgreSQL
* pg (Node PostgreSQL client)
* Python (data processing)

---

## 📊 Key Highlights

* Real-world backend system design
* Handles large-scale hierarchical data
* Secure API implementation
* Optimized database queries

---

## 👨‍💻 Author

**Praneel Shivarkar**
