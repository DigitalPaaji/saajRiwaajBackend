const mongoose = require("mongoose");


const ratingSchema = mongoose.Schema({
  name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    review: {
      type: String,
      required: [true, "Review is required"],
      trim: true,
    },
      product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
    }, 
    title:{
    type: String,
      required: [true, "title is required"],
      trim: true,
    },
     rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Minimum rating is 1"],
      max: [5, "Maximum rating is 5"],
    },
},{
timestamps:true
})


const Review = mongoose.model("review",ratingSchema);

module.exports = Review;