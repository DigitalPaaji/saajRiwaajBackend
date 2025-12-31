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
    <div style="font-family: Arial, sans-serif; line-height:1.6">
      <h2>🛍️ Order Placed Successfully!</h2>
      <p>Hello <b>${userId.name}</b>,</p>

      <p>Thank you for your order. Your order has been placed successfully.</p>

      <h3>📦 Order Details</h3>
      <p><b>Order ID:</b> ${_id}</p>
      <p><b>Order Date:</b> ${new Date(createdAt).toLocaleString()}</p>
      <p><b>Payment Method:</b> ${paymentMethod}</p>
      <p><b>Payment Status:</b> ${paymentStatus}</p>

      <h3>🧾 Items</h3>
      <table border="1" cellpadding="8" cellspacing="0">
        <tr>
          <th>Product ID</th>
          <th>Qty</th>
          <th>Price</th>
        </tr>
        ${itemsHTML}
      </table>

      <h3>💰 Total Amount: ₹${amount}</h3>

      <h3>🚚 Shipping Address</h3>
      <p>
        ${shippingAddress.name}<br/>
        ${shippingAddress.addressLine}<br/>
        ${shippingAddress.city}, ${shippingAddress.state}<br/>
        ${shippingAddress.country} - ${shippingAddress.pincode}<br/>
        📞 ${shippingAddress.phone}
      </p>

      <p>We’ll notify you once your order is shipped.</p>

      <p>Thanks & Regards,<br/><b>Your Store Team</b></p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Your Store" <${process.env.EMAIL_USER}>`,
    to: userId.email,
    subject: "Order Confirmation - Thank You for Shopping!",
    html,
  });
};

module.exports = sendOrderMail;