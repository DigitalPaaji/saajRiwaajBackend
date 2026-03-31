const { redisClient } = require('../helper/redisConfig');
const User = require('../models/UserModel');
const jwt = require("jsonwebtoken");

const USER_JWT_SECRET = process.env.USER_JWT_SECRET;


const userAuth = async (req, res, next) => {

  const token = req.cookies.userToken;
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
  

    const decoded = jwt.verify(token, USER_JWT_SECRET);
     const userId = decoded.id;
  const cacheKey = `user:${userId}`;
    const cachedUser = await redisClient.get(cacheKey);

 if (cachedUser) {
      const user = JSON.parse(cachedUser);


      if (!user.role.includes("user")) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.user = user;
      return next();
    }


    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Optional: check that user has 'user' role
    if (!user.role.includes("user") ) {
      return res.status(403).json({ message: "Access denied" });
    }
   await redisClient.set(
      cacheKey,
      JSON.stringify(user),
      {
        EX: 300,
      }
    );
    req.user = user;
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired Token" });
  }
};

module.exports = userAuth;
