const express = require("express");
const { 
  createOffer, 
  getOffers, 
  getOfferBySlug, 
  deleteOffer ,
  getOfferByid
} = require("../controllers/OfferController");

const router = express.Router();

router.post("/", createOffer);               // Create offer
router.get("/", getOffers);                  // Get all offers
router.get("/byid/:slug", getOfferByid);        // Get single offer
router.get("/:slug", getOfferBySlug);        // Get single offer
router.delete("/:offerId", deleteOffer);     // Delete offer

module.exports = router;
