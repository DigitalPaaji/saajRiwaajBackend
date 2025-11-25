const Offer = require('../models/OfferModel');
const Product = require('../models/ProductModel'); // IMPORTANT

// Create an offer
exports.createOffer = async (req, res) => {
  try {
    const { title, image,minquantity,price } = req.body;
    const slug = title.toLowerCase().replace(/ /g, "-");

    const offer = await Offer.create({ title, slug, image,minquantity,price });
    res.json(offer);
  } catch (err) {
    res.status(500).json({ error: "Error creating offer" });
  }
};

// Get all offers
exports.getOffers = async (req, res) => {
  try {
    const offers = await Offer.find({});
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
// 🗑️ Delete an offer + remove offer from all products
exports.deleteOffer = async (req, res) => {
  try {
    const offerId = req.params.offerId;

    const deleted = await Offer.findByIdAndDelete(offerId);
    if (!deleted) {
      return res.status(404).json({ error: "Offer not found" });
    }

    // Remove offer from all products
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
