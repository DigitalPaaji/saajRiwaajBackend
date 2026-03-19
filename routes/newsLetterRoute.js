const express = require("express");
const { createNewsletter, getNewsLetter, deleteEmail } = require("../controllers/newsletterController");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.post("/send",createNewsletter)
router.get("/get",adminAuth,getNewsLetter)
router.delete("/delete/:id",adminAuth,deleteEmail)
module.exports = router;