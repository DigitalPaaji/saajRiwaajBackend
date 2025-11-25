const mongoose = require("mongoose");

const CartSchema = mongoose.Schema({
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
color:{
    type:String,
    default:null
}


},{timestamps:true});


module.exports = mongoose.model("cart",CartSchema)






