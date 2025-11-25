const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: true,
  },
  minquantity:{
    type:Number,
    required:true,
  },
  price:{
    type:Number,
    required:true,
  },
  products:[
    {type:mongoose.Schema.Types.ObjectId,
ref:"Product"
 }
  ]
});

module.exports = mongoose.model("Offer", OfferSchema);
