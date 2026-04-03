const deleteImage = require('../helper/deleteImage');
const { redisClient } = require('../helper/redisConfig');
const Offer = require('../models/OfferModel');
const Product = require('../models/ProductModel'); // IMPORTANT

// Create an offer
exports.createOffer = async (req, res) => {
  try {
    const { title,minquantity,price } = req.body;
    const slug = title.toLowerCase().replace(/ /g, "-");
     const image= req.file.filename;
    const offer = await Offer.create({ title, slug, image,minquantity,price });
  return  res.json({success:true});
  } catch (err) {
    res.status(500).json({ error: "Error creating offer",success:false });
  }
};

// Get all offers
exports.getOffers = async (req, res) => {
  try {


    const offers = await Offer.find();
    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: "Error fetching offers" });
  }
};

// Get offer by slug
exports.getOfferBySlug = async (req, res) => {
  try {
    const offer = await Offer.findOne({ slug: req.params.slug });
    if (!offer) return res.status(404).json({ error: "Offer not found" });

    res.json(offer);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};
exports.getOfferByid = async (req, res) => {
  try {
    const offer = await Offer.findOne({ _id: req.params.slug });
    if (!offer) return res.status(404).json({ error: "Offer not found" });

    res.json(offer);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

exports.deleteOffer = async (req, res) => { 
  try {
    const offerId = req.params.offerId;

    const deleted = await Offer.findById(offerId);
    if (!deleted) {
      return res.status(404).json({ error: "Offer not found" });
    }

   await deleteImage(deleted.image)
   await deleted.deleteOne()
    await Product.updateMany(
      { offer: offerId },
      { $unset: { offer: "" } }
    );

    res.json({ message: "Offer deleted & removed from all products" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error deleting offer" });
  }
};


exports.getOffersAll = async (req, res) => {
  try {
const casheKey = "alloffers"

// const casheOffer = await redisClient.get(casheKey);
// if(casheOffer){
// return  res.json(JSON.parse(casheOffer));
// }
    const offers = await Offer.find();
    
    // await redisClient.set(casheKey,JSON.stringify(offers),{
    // EX:300
    // })

    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: "Error fetching offers" });
  }
};


exports.ToggleShowOnScreen= async(req,res)=>{
  try {
    const {id} = req.params;
  const offer = await Offer.findById(id)

  offer.showonpage = !offer.showonpage;
   await offer.save();

   return res.json({
    success:true,
    message:"status Updated"
   })


  } catch (error) {
    
   return res.json({
    success:false,
    message:error
   })


  }
}

exports.getFroentOffers = async(req,res)=>{
  try {
    try {
const casheKey = "alloffersStatus"

// const casheOffer = await redisClient.get(casheKey);
// if(casheOffer){
// return  res.json(JSON.parse(casheOffer));
// }
    const offers = await Offer.find({showonpage:true});
    
    // await redisClient.set(casheKey,JSON.stringify(offers),{
    // EX:300
    // })

    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: "Error fetching offers" });
  }
  } catch (error) {
    
  }
}

