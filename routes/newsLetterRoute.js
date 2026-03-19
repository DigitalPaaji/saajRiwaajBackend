const express = require("express");
const { createNewsletter } = require("../controllers/newsletterController");

const router = express.Router();

router.post("/send",createNewsletter)

module.exports = router;