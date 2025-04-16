-- migrations/01_create_tables.sql
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  username VARCHAR(255),
  password VARCHAR(255),
  email VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS user_plants (
  id SERIAL PRIMARY KEY,
  user_id UUID,
  common_name VARCHAR(255),
  image TEXT,
  last_watering_date VARCHAR(255),
  last_fertilize_date VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS external_plant_data (
  id SERIAL PRIMARY KEY,
  common_name VARCHAR(255) UNIQUE,
  watering VARCHAR(255),
  sunlight VARCHAR(255),
  cycle VARCHAR(255),
  edible BOOLEAN,
  toxicity VARCHAR(255),
  description TEXT,
  source VARCHAR(255),
  location VARCHAR(255)
);
