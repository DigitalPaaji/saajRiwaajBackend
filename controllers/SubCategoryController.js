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
   