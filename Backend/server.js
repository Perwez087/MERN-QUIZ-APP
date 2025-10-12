const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes/routes");
const database = require("./config/database");

// Connect to DB
database.connectToDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://mern-quiz-app-xi.vercel.app"
];

// CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

// ✅ Preflight OPTIONS handler
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", allowedOrigins.join(","));
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");
  res.sendStatus(200);
});

// Base route
app.get("/", (req, res) => {
  res.json({ success: true, message: "Server is running..." });
});

// API routes
app.use("/api/v1", routes);

// Export for Vercel
module.exports = app;

// Run locally only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
