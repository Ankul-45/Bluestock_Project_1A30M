-- STATES
CREATE TABLE states (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10),
    name VARCHAR(100)
);

-- DISTRICTS
CREATE TABLE districts (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10),
    name VARCHAR(100),
    state_id INTEGER REFERENCES states(id)
);

-- SUB DISTRICTS
CREATE TABLE sub_districts (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10),
    name VARCHAR(100),
    district_id INTEGER REFERENCES districts(id)
);

-- VILLAGES
CREATE TABLE villages (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE,
    name VARCHAR(100),
    sub_district_id INTEGER REFERENCES sub_districts(id)
);

-- API KEYS
CREATE TABLE api_keys (
    id SERIAL PRIMARY KEY,
    api_key VARCHAR(100),
    api_secret VARCHAR(100)
);