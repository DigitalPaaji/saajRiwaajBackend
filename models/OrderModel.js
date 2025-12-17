const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      price: Number,
     color:{
    type:mongoose.Schema.Types.ObjectId,
    required: true
  }

    }
  ],

  shippingAddress: {
    name: String,
    phone: String,
    pincode: String,
    city: String,
    state: String,
    country: String,
    addressLine: String,
  },

  paymentMethod: { type: String, enum: ["COD", "ONLINE"], default: "COD" },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },

  orderStatus: {
    type: String,
    enum: ["placed", "confirmed", "shipped", "delivered", "cancelled"],
    default: "placed",
  },
  cancelreason:{type:String,default:null},
   trackingnumber:{type:String,default:null},
  amount: Number,
  
}, { timestamps: true });


module.exports = mongoose.model("Order", orderSchema);
