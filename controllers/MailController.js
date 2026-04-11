const nodemailer = require("nodemailer");

exports.sendMail = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: process.env.EMAIL_USER,  
        pass: process.env.EMAIL_PASS,
      },
    });

   
let mailOptions = {
  from: `"${name}" <${email}>`,
  to: process.env.EMAIL_TO, 
  subject: "New Contact Form Submission | Saaj Riwaaj",
html: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px;">
  <h2 style="color: #B67032; margin-top: 0;">Saaj Riwaaj</h2>
  <p style="color: #555; border-bottom: 2px solid #B67032; padding-bottom: 10px;">New Contact Form Submission</p>
  
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Phone:</strong> ${phone}</p>
  
  <p style="margin-top: 20px;"><strong>Message:</strong></p>
  <p style="background: #fafafa; padding: 15px; border: 1px solid #eee; border-radius: 4px; white-space: pre-wrap;">${message}</p>
  
  <p style="font-size: 12px; color: #999; margin-top: 30px; text-align: center;">
    This message was sent via the Saaj Riwaaj website.
  </p>
</div>
`
};
    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Mail error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};
