const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const Product = require("../models/ProductModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Cart = require("../models/CartModel")

const USER_JWT_SECRET = process.env.USER_JWT_SECRET;
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
// ---------------------- SIGNUP ----------------------
const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: `User already exists with the email "${userExists.email}".`,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Signup Error: ", err);
    res.status(500).json({ message: "Server Error" });
  }
};
// ---------------------- LOGIN ----------------------
// loginUser
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid Email or Password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    // Only allow those who have "user" role
    if (!user.role.includes("user")) {
      return res.status(403).json({ message: "Access denied: Users only" });
    }

    const token = jwt.sign(
      { id: user._id, roles: user.role },
      USER_JWT_SECRET,
      { expiresIn: "1d" }
    );

    res
      .status(200)
      .cookie("userToken", token, {
         httpOnly: true,
        secure: process.env.NODE_ENV === "production", // production me true
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", 
        maxAge:5* 24 * 60 * 60 * 1000 ,
        path: "/"
        // httpOnly: true,
        // secure: false,
        // sameSite: "Lax",
        // maxAge: 24 * 60 * 60 * 1000,
        // path:'/',
        // domain: "localhost",
      })
      .json({
        message: "Login Successful",
        token,
        user: { name: user.name, email: user.email, role: user.role },
      });
  } catch (err) {
    console.error("User Login Failed:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// loginAdmin
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid Email or Password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });
    if (!user.role.includes("admin")) {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const token = jwt.sign(
      { id: user._id, roles: user.role },
      ADMIN_JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).cookie("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", 
        maxAge:5* 24 * 60 * 60 * 1000,
        path: "/"
     
      }).json({
        message: "Login Successful",
        token,
        user: { name: user.name, email: user.email, role: user.role },
      });
  } catch (err) {
    console.error("Admin Login Failed:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ---------------------- LOGOUT ----------------------
const logoutUser = (req, res) => {
  res.clearCookie("userToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", 
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    path: "/",
    
  });
  return res.status(200).json({ message: "Logged out" });
};

const logoutAdmin = (req, res) => {
  res.clearCookie("adminToken", {
httpOnly: true,
    secure: process.env.NODE_ENV === "production", 
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    path: "/",
  
  });
  return res.status(200).json({ message: "Admin Logged out Successfully." });
};
// ---------------------- FORGOT PASSWORD ----------------------
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "No user found with that email" });

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 5 * 60 * 1000; // 5 mins
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const message = `**Saaj Riwaaj - Password Reset Request**
We received a request to reset your password. We understand that sometimes even the most precious memories need a fresh clasp.
Click below to create a new password and keep exploring our timeless jewellery:

${resetUrl}

If you did not request this change, please ignore this email — your account will remain secure.

With love,
The Saaj Riwaaj Team 
`;

    await transporter.sendMail({
      from: `"Saaj Riwaaj" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Reset Your Saaj Riwaaj Password",
      text: message,
    });

    res.status(200).json({ message: "Password reset link sent to email" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ---------------------- RESET PASSWORD ----------------------
const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });

    if (!req.body.password || req.body.password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Check Token Validity
const checkTokenValidity = async (req, res) => {
  const crypto = require("crypto");
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }, // Check if not expired
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    res.status(200).json({ message: "Valid token" });
  } catch (err) {
    console.error("Token Check Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------- OTHER FUNCTIONS ----------------------
const getUser = async (req, res) => {
  if (!req.user) return res.status(204).send();
  const fullUser = await User.findById(req.user._id)
    .populate("cart.product")
    .populate("wishlist");
    const cart = await Cart.find({user:fullUser._id})

  res.status(200).json({ user: fullUser,cart });
};

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password") // password field hide karne ke liye
      .populate("cart.product")
      .populate("wishlist");

    res.status(200).json({ users });
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAdmin = async (req, res) => {
  if (!req.user) return res.status(204).send();

  // Just like getUser, but here you can fetch extra admin-related details if needed
  const fullAdmin = await User.findById(req.user._id);

  res.status(200).json({ user: fullAdmin });
};


const addToCart = async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity, color } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const colorKey = (color || "").trim().toLowerCase();

    // ✅ Check for same product + same color
    const existing = user.cart.find(
      (item) =>
        item.product.toString() === productId &&
        (item.color || "").trim().toLowerCase() === colorKey
    );

    if (existing) {
      // ✅ Update quantity if same variant already exists
      existing.quantity += quantity;
    } else {
      // ✅ Add as a new variant if different color
      user.cart.push({
        product: productId,
        quantity,
        color: color || null,
      });
    }

    await user.save();
    await user.populate("cart.product");

    res.status(200).json({ message: "Added to cart", cart: user.cart });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};





const addToWishlist = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    await user.populate("wishlist");

    res
      .status(200)
      .json({ message: "Added to wishlist", wishlist: user.wishlist });
  } catch (err) {
    console.error("Add to wishlist error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove from wishlist
const removeFromWishlist = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;

  try {
    const user = await User.findById(userId);
    user.wishlist = user.wishlist.filter(
      (item) => item.toString() !== productId
    );
    await user.save();
    await user.populate("wishlist");
    res.status(200).json({
      message: "Removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (err) {
    console.error("Remove from wishlist error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove from cart
const removeFromCart = async (req, res) => {
  const userId = req.user._id;
  const { productId, color } = req.body; // ✅ take color from body

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const colorKey = (color || "").trim().toLowerCase();

    user.cart = user.cart.filter(
      (item) =>
        !(
          item.product.toString() === productId &&
          (item.color || "").trim().toLowerCase() === colorKey
        )
    );

    await user.save();
    await user.populate("cart.product");
    res.status(200).json({ message: "Removed from cart", cart: user.cart });
  } catch (err) {
    console.error("Remove from cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Update cart quantity
const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity, color } = req.body;

    if (!productId || typeof quantity !== "number" || quantity < 1) {
      return res.status(400).json({ message: "Invalid product ID or quantity" });
    }

    const user = await User.findById(userId).populate("cart.product");
    if (!user) return res.status(404).json({ message: "User not found" });

    const colorKey = (color || "").trim().toLowerCase();

    const item = user.cart.find(
      (item) =>
        item.product._id.toString() === productId &&
        (item.color || "").trim().toLowerCase() === colorKey
    );

    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = quantity;

    await user.save();

    res.status(200).json({
      message: "Quantity updated successfully",
      cart: user.cart,
    });
  } catch (err) {
    console.error("Update quantity error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// const updateCartQuantity = async (req, res) => {
//   const userId = req.user._id;
//   const { productId, quantity } = req.body;

//   try {
//     const user = await User.findById(userId);
//     const item = user.cart.find(
//       (item) => item.product.toString() === productId
//     );

//     if (!item) {
//       return res.status(404).json({ message: "Item not found in cart" });
//     }

//     item.quantity = quantity;
//     await user.save();
//     await user.populate("cart.product");
//     res.status(200).json({ message: "Quantity updated", cart: user.cart });
//   } catch (err) {
//     console.error("Update quantity error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, phone, address } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...(name && { name }),
          ...(phone && { phone }),
          ...(address && { address }),
        },
      },
      { new: true }
    ).select("-password");

    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  signup,
  // login,
  loginAdmin,
  loginUser,
  getAdmin,
  getUser,
  getAllUsers,
  forgotPassword,
  resetPassword,
  checkTokenValidity,
  addToWishlist,
  removeFromWishlist,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  logoutAdmin,
  logoutUser,
  updateUserProfile,
};
