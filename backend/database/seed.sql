-- database/seed.sql
-- We rely on the DB connection to specify the database
INSERT INTO nutrition_reference (food_name, category, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sugar_per_100g, sodium_per_100g, calcium_per_100g, iron_per_100g, potassium_per_100g, vitamin_a_per_100g, vitamin_c_per_100g) VALUES
('Cooked Rice', 'Grains', 130, 2.7, 28.2, 0.3, 0.4, 0.1, 1, 10, 1.2, 35, 0, 0),
('Dal', 'Pulses', 116, 9, 20, 0.4, 8, 1, 2, 40, 3, 300, 0, 0),
('Roti', 'Breads', 297, 9.6, 56, 3, 9, 2, 350, 45, 3.5, 230, 0, 0),
('Paneer Butter Masala', 'Indian Main Course', 250, 10, 12, 18, 2, 4, 450, 200, 1.5, 150, 250, 5),
('Apple', 'Fruits', 52, 0.3, 14, 0.2, 2.4, 10, 1, 6, 0.1, 107, 3, 4.6),
('Banana', 'Fruits', 89, 1.1, 23, 0.3, 2.6, 12, 1, 5, 0.3, 358, 3, 8.7),
('Pizza', 'Fast Food', 266, 11, 33, 10, 2.3, 3.6, 598, 188, 2.5, 172, 10, 1.4),
('Salad', 'Vegetables', 15, 1, 3, 0.2, 1.5, 1.5, 10, 20, 0.5, 150, 100, 10),
('Burger', 'Fast Food', 295, 14, 24, 14, 1.2, 5, 414, 100, 2.5, 200, 5, 1),
('Chicken Biryani', 'Main Course', 150, 12, 18, 5, 1, 0.5, 300, 30, 1.5, 180, 10, 2),
('Pasta', 'Main Course', 131, 5, 25, 1.1, 1.2, 0.6, 6, 10, 1, 44, 0, 0);
