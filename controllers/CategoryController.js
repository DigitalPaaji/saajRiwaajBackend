const Category = require('../models/CategoryModel');
const ProductModel = require('../models/ProductModel');

exports.createCategory = async (req, res) => {
    try {
        const category = await Category.create({ name: req.body.name });        
        res.status(201).json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getCategories = async (req, res) => {
    const cats = await Category.find();
    res.setHeader("Content-Type", "application/json");

  return   res.status(200).json({cats});
};



exports.deleteCategory = async (req, res) => {
  try {
    // Find category
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const productsToDelete = await ProductModel.find({ category: req.params.id });
    const productIds = productsToDelete.map((p) => p._id);

    await ProductModel.deleteMany({ category: req.params.id });

    if (productIds.length > 0) {
      await User.updateMany(
        {},
        {
          $pull: {
            "cart": { product: { $in: productIds } },
            "wishlist": { $in: productIds },
          },
        }
      );
    }

    // Delete the category
    await Category.findByIdAndDelete(req.params.id);

    res.json({ message: "Category and its products deleted successfully" });
  } catch (err) {
    console.error("Delete category error:", err);
    res.status(500).json({ error: err.message });
  }
};
