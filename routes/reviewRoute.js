const { createReview, getReviews, deleteReview } =  require("../controllers/ReviewController");

const express = require("express");
const router = express.Router();


router.post("/create",createReview)
router.get("/get/:productid",getReviews)
router.delete("/delete/:reviewid",deleteReview)

module.exports =   router