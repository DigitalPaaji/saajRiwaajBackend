const { default: mongoose } = require("mongoose");
const Product = require("../models/ProductModel");


exports.getWishlist = async (req,res)=>{
    try {
        const {wishlistids} = req.body;
  if (!wishlistids || !Array.isArray(wishlistids)) {
      return res.status(400).json({
        success: false,
        message: "wishlistids must be an array",
      });
    }

  const objectIds = wishlistids.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

   
    const products = await Product.find({
      _id: { $in: objectIds },
    }).select(
      "name   price finalPrice  images colorVariants discount"
    );

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });


    } catch (error) {
        console.error("Wishlist Fetch Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist products",
    }); 
    }
}

