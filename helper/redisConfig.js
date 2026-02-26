const redis = require("redis");
require("dotenv").config();

const redisClient = redis.createClient({
  url: "redis://127.0.0.1:6379",
});

redisClient.on("error", (err) => {
  console.log("Redis Error:", err);
});

// Create async function to connect
const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("✅ Redis Connected");
  } catch (err) {
    console.log("❌ Redis Connection Failed:", err);
  }
};

module.exports = { redisClient, connectRedis };