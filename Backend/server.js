const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const routes = require("./routes/routes");
const cookieParser = require("cookie-parser");

const database = require("./config/database");

const PORT = process.env.PORT || 4000;

// connect to db
database.connectToDB();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ['http://localhost:5173', 'https://mern-quiz-app-xi.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Your server is up and running...",
  });
});

app.use("/api/v1/", routes);

// activate server
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
