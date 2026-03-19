const sendCouponMail = require("../helper/sendCopenCode");
const Newsletter = require("../models/newsletterModel");


const createNewsletter= async (req,res)=>{
try {
    const {email} = req.body;
    if(!email){
        return res.status(400).json({
        success: false,
        message: "Email is required",
      });

    }
   const existing = await Newsletter.findOne({email});
      if (existing) {
      return res.status(200).json({
        success: true,
        message: "Already subscribed",
      });
    }
   const couponcode = "SAAJRIWAAJ25"
const newsletter = await Newsletter.create({ email });

    // send mail AFTER saving
    await sendCouponMail(email, couponcode);
 return res.status(201).json({
      success: true,
      message: "Subscribed successfully",
      data: newsletter,
    });

} catch (error) {
      console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
}
}


const getNewsLetter = async(req,res)=>{
    try {
        const data = await Newsletter.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
        
    } catch (error) {
         console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
    }
}

const deleteEmail= async(req,res)=>{
try {
    const {id} = req.params;
       const deleted = await Newsletter.findByIdAndDelete(id);
          if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }
      return res.status(200).json({
      success: true,
      message: "Deleted successfully",
   
    });
} catch (error) {
     return res.status(500).json({
      success: false,
      message: "Server Error",
    });
}
}


module.exports ={
   createNewsletter,
   getNewsLetter ,
   deleteEmail
}