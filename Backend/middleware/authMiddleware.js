const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = (req, res, next) => {
  let token;

  // Check token from cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Check token from header
  else if (req.header("Authorization")) {
    const authHeader = req.header("Authorization");
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.replace("Bearer ", "");
    } else {
      token = authHeader; // fallback
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token." });
  }
};


const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).send({ error: "Access denied." });
  }
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware,
};
