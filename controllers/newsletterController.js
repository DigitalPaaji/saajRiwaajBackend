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




module.exports ={
   createNewsletter 
}