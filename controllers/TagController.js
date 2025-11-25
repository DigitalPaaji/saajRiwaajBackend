const ProductModel = require('../models/ProductModel');
const Tag = require('../models/TagModel');

exports.createTag = async (req, res) => {
    try {
        const tag = await Tag.create({ name: req.body.name });
         res.status(200).json({ message: "Tag deleted" }); 
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getTags = async (req, res) => {
    const tags = await Tag.find();
    res.json({tags});
};

exports.deleteTag = async (req, res) => {
  try {
    const tagId = req.params.id;

    await Tag.findByIdAndDelete(tagId);

    await ProductModel.updateMany(
      { tags: tagId },               
      { $pull: { tags: tagId } }    
    );

    res.status(200).json({ message: "Tag deleted" });
  } catch (err) {
    console.error("Error deleting tag:", err);
    res.status(500).json({ message: "Server error" });
  }
};
