const express = require("express");
const { 
  createOffer, 
  getOffers, 
  getOfferBySlug, 
  deleteOffer ,
  getOfferByid,
  getOffersAll,
  ToggleShowOnScreen,
  getFroentOffers
} = require("../controllers/OfferController");
const upload = require("../helper/saveImage");

const router = express.Router();

router.post("/",upload.single("image"), createOffer);              
router.get("/", getOffers);                  

router.get("/all",getOffersAll)
router.put("/toggle/:id",ToggleShowOnScreen)
router.get("/forshow",getFroentOffers)

router.get("/byid/:slug", getOfferByid);        
router.get("/:slug", getOfferBySlug);        
router.delete("/:offerId", deleteOffer);    

module.exports = router;
