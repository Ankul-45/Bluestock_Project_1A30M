# 📍 # 🚀 India Location API System (Flask + PostgreSQL)
🚀 Built a production-style backend system with database design, secure APIs, and optimized search for large-scale location data.

## 🚀 Overview
This project is a scalable backend system that provides structured access to India’s location data (States, Districts, Subdistricts, Villages).

It is designed like a real-world SaaS API used in:
- Address systems
- Logistics platforms
- KYC verification

---

## 🧠 What I Built
## 👨‍💻 My Contribution

- Designed and implemented PostgreSQL database
- Built REST APIs using Flask
- Implemented search using SQL joins
- Added API key authentication
- Optimized performance using indexing and pagination

### 🗄️ Database Design (PostgreSQL)
- Designed a normalized relational database
- Tables:
  - states
  - districts
  - sub_districts
  - villages
- Implemented foreign key relationships
- Handled large dataset efficiently

---

### ⚙️ Backend API (Flask)
- Built REST APIs:
- `GET /states`
- `GET /states/{id}/districts`
- `GET /districts/{id}/subdistricts`
- `GET /subdistricts/{id}/villages`
- Implemented filtering and sorting

---

### 🔍 Search System
- Implemented search using SQL JOINs across multiple tables
- Example:
/search?q=pune

---

### 🔐 API Authentication
- Built API key-based authentication system
- Secured endpoints using headers:
x-api-key
x-api-secret

---
## 🗄️ Database Setup

Run the following file in PostgreSQL:
schema.sql


Then insert data using:


python data.py


### ⚡ Performance Optimization
- Added indexing on frequently searched fields
- Implemented pagination for large data handling

---

## 🧪 Tech Stack

- Python (Flask)
- PostgreSQL
- psycopg2
- Postman (API testing)

---

## ▶️ How to Run

```bash
pip install -r requirements.txt
python app.py

## 🔥 Key Features

- Scalable relational database design
- Secure API access using API keys
- Fast search using SQL joins and indexing
- Pagination for large dataset handling
- Clean REST API architecture

## 👨‍💻 Author

**Praneel Shivarkar**