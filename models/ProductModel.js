const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Category",
   
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "SubCategory",
    default: null,
  },
  description: {
    paragraphs: { type: [String], default: [] },
    bulletPoints: { type: [String], default: [] },
  },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  offer:{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Offer",
    default: null,
  }
,
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isNewArrival: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: { type: Number, default: 0 },
  finalPrice: { type: Number, default: 0 },
  images: [{ type: String }],
  colorVariants: [
    {
      colorName: { type: String, required: true },
      quantity: { type: Number, default: 1 },
    },
  ],
});

productSchema.post("findOneAndDelete", async function (doc) {
  if (!doc) return;
  const User = require("../models/UserModel");
  await User.updateMany(
    {},
    {
      $pull: {
        cart: { product: doc._id },
        wishlist: doc._id,
      },
    }
  );
  console.log(` Product ${doc._id} removed from all carts and wishlists.`);
});

module.exports = mongoose.model("Product", productSchema);
