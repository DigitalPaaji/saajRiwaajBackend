const SubCategory = require('../models/SubCategoryModel');
const ProductModel = require('../models/ProductModel');

exports.createCategory = async (req, res) => {
    try {
          const { name, category } = req.body;
        const subCategory = await SubCategory.create({ name, category });
        res.status(201).json(subCategory);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getCategories = async (req, res) => {
    const cats = await SubCategory.find();
    res.json({cats});
};

exports.getByCategory = async (req, res) => {
    try {
        
        const subs = await SubCategory.find({ category: req.params.categoryId });
        res.json(subs);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.deleteCategory = async (req, res) => {
    const subcategoryId = req.params.id;
    try {
        await SubCategory.findByIdAndDelete(subcategoryId);
        await ProductModel.updateMany({ subcategory: subcategoryId }, { $unset: { subcategory: "" } });
        res.json({ message: "SubCategory Deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.updateSubcat = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category } = req.body;

    // 🔹 Validation
    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Name and category are required",
      });
    }

    // 🔹 Check if subcategory exists
    const existingSubcat = await SubCategory.findById(id);
    if (!existingSubcat) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found",
      });
    }



    const duplicate = await SubCategory.findOne({
      name,
      category,
      _id: { $ne: id },
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "SubCategory already exists in this category",
      });
    }

    // 🔹 Update
    existingSubcat.name = name;
    existingSubcat.category = category;

    await existingSubcat.save();

    // 🔹 Response
    return res.status(200).json({
      success: true,
      message: "SubCategory updated successfully",
      subcat: existingSubcat,
    });

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

