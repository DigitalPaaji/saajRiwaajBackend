const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

// I renamed the function slightly to reflect its purpose, 
// and destructured the exact fields you need.
const sendCouponMail = async (email, couponcode) => {
  
  // The brand color we used on the frontend
  const brandColor = "#99571d"; 

  // HTML Email Template with Inline CSS
  const html = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fafaf9; color: #1c1917;">
      
      <div style="text-align: center; padding: 40px 20px; background-color: #ffffff; border: 1px solid #e7e5e4; border-radius: 12px;">
        
        <h1 style="margin: 0 0 15px; font-size: 28px; font-weight: 300; letter-spacing: 1px;">
          Welcome to the List.
        </h1>
        
        <p style="font-size: 16px; line-height: 1.6; color: #57534e; margin-bottom: 30px;">
          Thank you for joining our exclusive community. As promised, here is your special discount code for <strong>25% off</strong> your first jewelry purchase with us.
        </p>
        
        <div style="margin: 30px 0; padding: 25px; background-color: #f5f5f4; border: 2px dashed ${brandColor}; border-radius: 8px;">
          <p style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #78716c; margin-bottom: 10px;">
            Use Code at Checkout
          </p>
          <p style="margin: 0; font-size: 32px; font-weight: bold; color: ${brandColor}; letter-spacing: 4px;">
            ${couponcode}
          </p>
        </div>
        
        <p style="font-size: 14px; color: #78716c; margin-bottom: 40px;">
          *This code applies to all items in our store and does not expire.
        </p>

        <a href="https://saajriwaaj.com" style="display: inline-block; background-color: ${brandColor}; color: #ffffff; text-decoration: none; padding: 16px 32px; font-size: 16px; font-weight: bold; border-radius: 8px; text-transform: uppercase; letter-spacing: 1px;">
          Shop the Collection
        </a>

      </div>
      
      <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #a8a29e;">
        <p>If you have any questions, simply reply to this email.</p>
        <p>© ${new Date().getFullYear()} Your Jewelry Store. All rights reserved.</p>
      </div>

    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Lux Jewelry" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome! 💎 Your 25% OFF code is inside.",
      html: html, // Attach the HTML template here
    });

    console.log("Coupon email sent successfully: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending coupon email:", error);
    return false;
  }
};

module.exports = sendCouponMail;