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
html: `
<div style="background-color:#faf8ea; padding:10px; font-family:Arial, Helvetica, sans-serif; color:#333;">
  <table role="presentation" style="width:100%; max-width:700px; margin:0 auto; background:#ffffff; border:1px solid #e6e6e6; border-radius:8px;" cellspacing="0" cellpadding="0">

    
    <tr>
      <td style="background:#fff; border-bottom:2px solid #B67032; padding:15px; text-align:center;">
        <h2 style="margin:0; font-size:20px; color:#B67032; letter-spacing:0.5px;">Saaj Riwaaj</h2>
        <p style="margin:5px 0 0; font-size:14px; color:#555;">New Contact Form Submission</p>
      </td>
    </tr>

    
    <tr>
      <td style="padding:20px;">
        <p style="font-size:16px; margin-bottom:15px; color:#444;">You have received a new message from your website contact form:</p>

        <table role="presentation" style="width:100%; border-collapse:collapse; font-size:15px;">
          <!-- Name -->
          <tr>
            <td style="padding:10px; background:#fafafa; border:1px solid #eee; font-weight:bold; color:#B67032;">Name</td>
          </tr>
          <tr>
            <td style="padding:10px; border:1px solid #eee; word-break:break-word;">${name}</td>
          </tr>

          <!-- Email -->
          <tr>
            <td style="padding:10px; background:#fafafa; border:1px solid #eee; font-weight:bold; color:#B67032;">Email</td>
          </tr>
          <tr>
            <td style="padding:10px; border:1px solid #eee; word-break:break-word;">${email}</td>
          </tr>

          <!-- Phone -->
          <tr>
            <td style="padding:10px; background:#fafafa; border:1px solid #eee; font-weight:bold; color:#B67032;">Phone</td>
          </tr>
          <tr>
            <td style="padding:10px; border:1px solid #eee;">${phone}</td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding:10px; background:#fafafa; border:1px solid #eee; font-weight:bold; color:#B67032;">Message</td>
          </tr>
          <tr>
            <td style="padding:10px; border:1px solid #eee; line-height:1.5; word-break:break-word;">${message}</td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background:#faf8ea; padding:12px; text-align:center; font-size:12px; color:#666; border-top:1px solid #e6e6e6;">
        <p style="margin:0;">This message was sent via the <strong>Saaj Riwaaj</strong> website.</p>
      </td>
    </tr>

  </table>
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
