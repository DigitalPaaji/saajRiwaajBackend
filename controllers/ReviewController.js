const Product = require("../models/ProductModel");
const Review = require("../models/ratingModel")



exports.createReview = async (req, res) => {
  try {
    const { name, email, title, review, rating, product } = req.body;


    if (!name || !email || !review || !rating || !product) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }
 

    const getProduct = await Product.findById(product);
    if (!getProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ✅ Create Review
    const newReview = await Review.create({
      name,
      email,
      title,
      review,
      rating,
      product,
    });

    // ✅ Calculate new rating
    const oldRating = getProduct.rating || 0;
    const oldReviewCount = getProduct.reviewCount || 0;

    const totalRating = oldRating * oldReviewCount + Number(rating);
    const newReviewCount = oldReviewCount + 1;
    const newRating = totalRating / newReviewCount;

   
    getProduct.rating = newRating;
    getProduct.reviewCount = newReviewCount;

    await getProduct.save();

    // ✅ Response
    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: newReview,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
exports.getReviews = async (req, res) => {
  try {
    const { productid } = req.params;

    if (!productid) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const reviews = await Review.find({ product: productid })
      .sort({ createdAt: -1 }); 

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { reviewid } = req.params;

 
    if (!reviewid) {
      return res.status(400).json({
        success: false,
        message: "Review ID is required",
      });
    }


    const review = await Review.findById(reviewid);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

  
    await Review.findByIdAndDelete(reviewid);

  
    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};