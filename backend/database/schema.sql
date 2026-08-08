-- database/schema.sql
CREATE DATABASE IF NOT EXISTS foodsnap_ai;
USE foodsnap_ai;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    goal VARCHAR(255) DEFAULT 'Healthy Eating',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS nutrition_reference (
    id INT AUTO_INCREMENT PRIMARY KEY,
    food_name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    calories_per_100g FLOAT DEFAULT 0,
    protein_per_100g FLOAT DEFAULT 0,
    carbs_per_100g FLOAT DEFAULT 0,
    fat_per_100g FLOAT DEFAULT 0,
    fiber_per_100g FLOAT DEFAULT 0,
    sugar_per_100g FLOAT DEFAULT 0,
    sodium_per_100g FLOAT DEFAULT 0,
    calcium_per_100g FLOAT DEFAULT 0,
    iron_per_100g FLOAT DEFAULT 0,
    potassium_per_100g FLOAT DEFAULT 0,
    vitamin_a_per_100g FLOAT DEFAULT 0,
    vitamin_c_per_100g FLOAT DEFAULT 0,
    vitamin_d_per_100g FLOAT DEFAULT 0,
    vitamin_b12_per_100g FLOAT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS food_scans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    food_name VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    confidence INT,
    estimated_weight FLOAT,
    confirmed_weight FLOAT NOT NULL,
    serving_unit VARCHAR(50) DEFAULT 'g',
    calories FLOAT DEFAULT 0,
    protein FLOAT DEFAULT 0,
    carbohydrates FLOAT DEFAULT 0,
    fat FLOAT DEFAULT 0,
    fiber FLOAT DEFAULT 0,
    sugar FLOAT DEFAULT 0,
    sodium FLOAT DEFAULT 0,
    health_score INT DEFAULT 0,
    health_category VARCHAR(100),
    image_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
