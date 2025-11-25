const express = require("express");
const { sendMail } = require("../controllers/MailController");

const router = express.Router();

router.post("/send-mail", sendMail);

module.exports = router;
