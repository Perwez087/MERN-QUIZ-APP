const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const routes = require("./routes/routes");
const cookieParser = require("cookie-parser");
const database = require("./config/database");

// ✅ Connect to DB
database.connectToDB();

app.use(express.json());
app.use(cookieParser());

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://mern-quiz-app-xi.vercel.app" // <-- your frontend domain
];

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
  })
);

// ✅ Base route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Your server is up and running...",
  });
});

// ✅ Routes
app.use("/api/v1", routes);

// ✅ Export for Vercel (important)
module.exports = app;

// ✅ Run locally only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
  });
}
