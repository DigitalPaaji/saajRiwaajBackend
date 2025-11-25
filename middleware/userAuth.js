const User = require('../models/UserModel');
const jwt = require("jsonwebtoken");

const USER_JWT_SECRET = process.env.USER_JWT_SECRET;
// const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET;

const userAuth = async (req, res, next) => {
  // Accept either userToken or adminToken
  const token = req.cookies.userToken;
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    // Detect which secret to use
    // let decoded;
    // if (req.cookies.userToken) {
    //   decoded = jwt.verify(req.cookies.userToken, USER_JWT_SECRET);
    // } else {
    //   decoded = jwt.verify(req.cookies.adminToken, ADMIN_JWT_SECRET);
    // }

    const decoded = jwt.verify(token, USER_JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Optional: check that user has 'user' role
    if (!user.role.includes("user") ) {
      return res.status(403).json({ message: "Access denied" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Invalid or expired Token" });
  }
};

module.exports = userAuth;
