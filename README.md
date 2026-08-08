# 🍎 FoodSnap AI

**Snap Your Food. Understand Your Nutrition.**

FoodSnap AI is a full-stack web application that allows users to snap a photo of their food using their camera or upload an image, and uses AI to identify the food, ingredients, and portion size to calculate nutritional information and provide a health score.

## Features
- **User Authentication:** Secure JWT-based registration and login.
- **AI Food Recognition:** Upload or snap a picture of food to identify it using Google's Gemini Vision AI.
- **Portion Estimation & Confirmation:** AI estimates the portion, and users can confirm or adjust it for accurate calculation.
- **Nutritional Calculation:** Calculates precise macros, vitamins, and minerals using a MySQL reference database.
- **Health Score Dashboard:** Beautiful visualization of your food's health score using Recharts and Framer Motion.
- **Food History:** Save your scans and view your past meals.

## Technology Stack
- **Frontend:** React, Vite, React Router, Recharts, Framer Motion, Axios, plain CSS.
- **Backend:** Node.js, Express.js, Multer (for image uploads), Google GenAI SDK.
- **Database:** MySQL.
- **Authentication:** JWT, bcrypt.

## Folder Structure
```text
foodsnap-ai/
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route pages
│   │   ├── services/     # API clients
│   │   ├── context/      # React Context (Auth)
│   │   └── App.jsx       # Main routing
├── backend/              # Node.js Express server
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # JWT auth and Multer upload
│   ├── routes/           # Express routes
│   ├── services/         # AI Service logic
│   ├── database/         # SQL schema and seeds
│   └── server.js         # Entry point
└── README.md
```

## Installation Steps

### 1. Database Setup
1. Ensure MySQL is installed and running on your machine.
2. Log into MySQL and run the scripts provided:
   ```sql
   source backend/database/schema.sql;
   source backend/database/seed.sql;
   ```

### 2. Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file by copying the `.env.example`: `cp .env.example .env`
4. Update the `.env` file with your MySQL credentials, a JWT secret, and your Google Gemini API Key (`AI_API_KEY`).
5. Start the server: `npm run dev` (starts on port 5000)

### 3. Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the Vite dev server: `npm run dev`

## Environment Variables
**Backend (`backend/.env`):**
- `PORT=5000`
- `DB_HOST=localhost`
- `DB_USER=root`
- `DB_PASSWORD=yourpassword`
- `DB_NAME=foodsnap_ai`
- `JWT_SECRET=your_jwt_secret`
- `AI_API_KEY=your_gemini_api_key`

**Frontend (`frontend/.env`):**
- `VITE_API_URL=http://localhost:5000/api`

## Future Improvements
- Integrate a massive external nutrition API (like USDA) instead of a local MySQL reference table for unlimited food coverage.
- Add daily calorie tracking and goal progress bars.
- Add a "Recipe Generation" feature based on scanned ingredients.
