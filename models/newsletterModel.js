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

const Newsletter = mongoose.model("newsletter",newsletterSchema);

module.export = Newsletter;