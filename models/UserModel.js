const mongoose = require("mongoose");



const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
 
  password:{
    type:String
  },
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

  


  wishlist: [
    { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],


});


const User = mongoose.model("User", userSchema);
module.exports = User;
