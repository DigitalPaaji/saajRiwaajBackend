const mongoose  = require("mongoose");

  const pagesSchema  =  mongoose.Schema({
  pageType:{
    type:String,
    enum:["faq","terms-conditions","privacy-policy","refund-policy","delivery-information","about-us"]
  },
  contant:[{
heading:{type:String,default:null,trim:true},
des:{type:String,default:null,trim:true}
  },]


  },{timestamps:true});


  const Pages  = mongoose.model("pages",pagesSchema);

  module.exports = Pages;