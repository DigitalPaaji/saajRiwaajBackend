// middleware/isAdmin.js
const User = require('../models/UserModel');
const jwt = require("jsonwebtoken");
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET;

const adminAuth  = async (req, res, next) => {
  const token = req.cookies.adminToken;
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
      if (!user || !user.role.includes("admin")) {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired Token" });
  }
};

module.exports = adminAuth ;
