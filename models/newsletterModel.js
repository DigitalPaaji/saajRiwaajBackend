const mongoose = require("mongoose");


const newsletterSchema =  mongoose.Schema({
    email:{
        type:String,
        required:true,
       trim:true,
       unique:true  
    }
},{
    timestamps:true
});

module.exports  = mongoose.model("newsletter",newsletterSchema);

