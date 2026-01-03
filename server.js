const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const path = require("path");

// Routes
const Product = require("./routes/productRoutes");
const Tags = require("./routes/TagRoutes");
const Categories = require("./routes/CategoryRoutes");
const SubCategories = require("./routes/SubCategoryRoute");
const bannerRoutes = require("./routes/BannerRoute");
const userRoutes = require("./routes/UserRoutes");
const couponRoutes = require("./routes/CouponRoutes");
const orderRoutes = require("./routes/OrderRoutes");
const mailRoutes = require("./routes/MailRoutes");
const offerRoutes = require("./routes/OfferRoute");
const cartRoutes = require("./routes/CartRoute");
const pagesRoutes = require("./routes/pagesRoutes");

const app = express();

/* =========================
   STATIC FILES
========================= */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* =========================
   CORS (iOS SAFE)
========================= */
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        process.env.FRONTEND_URL,          // main domain
        "https://saaj-riwaaj.vercel.app",  // vercel preview
      ];

      // allow server-to-server / postman / iOS Safari
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

/* 🔥 REQUIRED FOR iOS PREFLIGHT */
app.use(cors());


/* =========================
   MIDDLEWARES
========================= */
app.use(express.json());
app.use(cookieParser());

/* =========================
   DATABASE
========================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("Saaj Riwaaj Backend Running!");
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

/* =========================
   ROUTES
========================= */
app.use("/product", Product);
app.use("/tag", Tags);
app.use("/category", Categories);
app.use("/subcategory", SubCategories);
app.use("/banner", bannerRoutes);
app.use("/user", userRoutes);
app.use("/coupon", couponRoutes);
app.use("/order", orderRoutes);
app.use("/api", mailRoutes);
app.use("/offer", offerRoutes);
app.use("/cart", cartRoutes);
app.use("/pages", pagesRoutes);

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
