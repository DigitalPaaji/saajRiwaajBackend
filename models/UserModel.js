const mongoose = require("mongoose");

// 🛒 Subschema for each cart item
const cartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    color: { type: String, default: null },
    quantity: { type: Number, default: 1 },
   
  },
  { _id: true } 
);
 

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  
  role: {
    type: [String],
    enum: ["user", "admin"],
    default: ["user"], 
  },

  phone: { type: String, default: "" },

  address: {
    pincode: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
    addressLine: { type: String, default: "" },
  },

  // ✅ Use subschema here
  cart: [cartItemSchema],

  wishlist: [
    { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Export the model
const User = mongoose.model("User", userSchema);
module.exports = User;
