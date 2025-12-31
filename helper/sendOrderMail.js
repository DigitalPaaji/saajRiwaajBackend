const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: `${process.env.EMAIL_USER}`, 
    pass:  `${process.env.EMAIL_PASS}`, 
  },
});


const sendOrderMail = async (order) => {
  const {
    shippingAddress,
    userId,
    items,
    amount,
    paymentMethod,
    paymentStatus,
    _id,
    createdAt,
  } = order;

  const itemsHTML = items
    .map(
      (item) => `
      <tr>
        <td>${item.product}</td>
        <td>${item.quantity}</td>
        <td>₹${item.price}</td>
      </tr>
    `
    )
    .join("");

const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Mobile Responsiveness */
    @media only screen and (max-width: 600px) {
      .main-table { width: 100% !important; }
      .mobile-stack { display: block !important; width: 100% !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4; padding: 20px 0;">
    <tr>
      <td align="center">
        
        <table border="0" cellpadding="0" cellspacing="0" class="main-table" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          
          <tr>
            <td align="center" style="background-color: #2c3e50; padding: 20px;">
              <h2 style="color: #ffffff; margin: 0; font-size: 24px;">🛍️ Order Confirmed</h2>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px 30px 10px 30px; color: #333333;">
              <p style="font-size: 16px; margin: 0;">Hello <b>${userId.name}</b>,</p>
              <p style="color: #666666; font-size: 14px; line-height: 1.5;">Thank you for shopping with us! Your order has been placed successfully and is being processed.</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 10px 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8f9fa; border-radius: 6px; padding: 15px;">
                <tr>
                  <td width="50%" valign="top" style="padding-bottom: 10px;">
                    <p style="margin: 0; font-size: 12px; color: #888;">Order ID</p>
                    <p style="margin: 5px 0 0; font-weight: bold; color: #333;">#${_id}</p>
                  </td>
                  <td width="50%" valign="top">
                    <p style="margin: 0; font-size: 12px; color: #888;">Status</p>
                    <p style="margin: 5px 0 0; font-weight: bold; color: #28a745;">${paymentStatus}</p>
                  </td>
                </tr>
                <tr>
                 <td width="50%" valign="top" style="padding-bottom: 10px;">
                    <p style="margin: 0; font-size: 12px; color: #888;">Date</p>
                    <p style="margin: 5px 0 0; font-weight: bold; color: #333;">${new Date(createdAt).toLocaleDateString()}</p>
                  </td>
                  <td width="50%" valign="top">
                    <p style="margin: 0; font-size: 12px; color: #888;">Payment Method</p>
                    <p style="margin: 5px 0 0; font-weight: bold; color: #333;">${paymentMethod}</p>
                  </td>
                 
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 30px;">
              <h3 style="margin: 0 0 15px; color: #333; font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 10px;">🧾 Order Summary</h3>
              <table border="0" cellpadding="10" cellspacing="0" width="100%" style="border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f8f8f8; color: #555; text-align: left;">
                    <th style="border-bottom: 2px solid #ddd; font-size: 14px;">Product</th>
                    <th style="border-bottom: 2px solid #ddd; font-size: 14px; text-align: center;">Qty</th>
                    <th style="border-bottom: 2px solid #ddd; font-size: 14px; text-align: right;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML} 
                  </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" align="right" style="padding-top: 15px; font-weight: bold; color: #333;">Total Amount:</td>
                    <td align="right" style="padding-top: 15px; font-weight: bold; color: #d32f2f; font-size: 18px;">₹${amount}</td>
                  </tr>
                </tfoot>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h3 style="margin: 0 0 10px; color: #333; font-size: 16px;">🚚 Shipping Address</h3>
              <div style="border: 1px solid #eee; border-radius: 6px; padding: 15px; background-color: #fff;">
                <p style="margin: 0; font-weight: bold; color: #333;">${shippingAddress.name}</p>
                <p style="margin: 5px 0 0; color: #555; font-size: 14px;">
                  ${shippingAddress.addressLine}<br/>
                  ${shippingAddress.city}, ${shippingAddress.state}<br/>
                  ${shippingAddress.country} - ${shippingAddress.pincode}
                </p>
                <div style="margin-top: 10px; font-size: 13px; color: #777;">
                  <span style="margin-right: 15px;">📩 ${shippingAddress.email}</span>
                  <span>📞 ${shippingAddress.phone}</span>
                </div>
              </div>
            </td>
          </tr>

          <tr>
            <td align="center" style="background-color: #f8f9fa; padding: 30px; border-top: 1px solid #eee;">
              <p style="margin: 0 0 20px; font-size: 14px; color: #666;">Need help with your order?</p>
              
              <a href="https://wa.me/9988823422" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 25px; font-weight: bold; font-size: 15px; box-shadow: 0 2px 5px rgba(37, 211, 102, 0.3);">
                💬 Contact on WhatsApp
              </a>

              <p style="margin: 25px 0 0; font-size: 12px; color: #999;">
                Thanks & Regards,<br/>
                <b>Your Store Team</b>
              </p>
            </td>
          </tr>

        </table>
        
        <table height="40"><tr><td></td></tr></table>
        
      </td>
    </tr>
  </table>
</body>
</html>
`;

  await transporter.sendMail({
    from: `"Your Store" <${process.env.EMAIL_USER}>`,
    to: shippingAddress.email,
    subject: "Order Confirmation - Thank You for Shopping!",
    html,
  });
};

module.exports = sendOrderMail;