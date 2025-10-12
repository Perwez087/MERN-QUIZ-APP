const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const routes = require("./routes/routes");
const cookieParser = require("cookie-parser");
const database = require("./config/database");

// ✅ Connect to DB
database.connectToDB();

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173",               // local frontend
  "https://mern-quiz-app-xi.vercel.app" // deployed frontend
];

// ✅ CORS setup with preflight handling
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // allow all methods
    allowedHeaders: ["Content-Type", "Authorization"],    // allow these headers
  })
);

// ✅ Handle preflight requests
app.options("*", cors());

// ✅ Base route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Your server is up and running...",
  });
});

// ✅ API routes
app.use("/api/v1", routes);

// ✅ Export for Vercel serverless
module.exports = app;

// ✅ Run locally
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
  });
}
