const deleteCatImage = require('../helper/deleteCatImg');
const { redisClient } = require('../helper/redisConfig');
const Category = require('../models/CategoryModel');
const ProductModel = require('../models/ProductModel');
const SubCategory = require('../models/SubCategoryModel');

exports.createCategory = async (req, res) => {
    try {

      const image = req.file;

     
        const category = await Category.create({ name: req.body.name,image:image.path });        
        res.status(201).json({success:true,category});
    } catch (err) {
      
        res.status(400).json({ error: err.message });
    }
};

exports.getCategories = async (req, res) => {
  const cashkey = "category";

// const cashedData= await redisClient.get(cashkey)
// if(cashedData){
//     return   res.status(200).json({cats:JSON.parse(cashedData)});
// }

     
    const cats = await Category.find();
    res.setHeader("Content-Type", "application/json");

    // await redisClient.set(cashkey,JSON.stringify(cats),{
    //   EX: 60 * 5,
    // })

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

    if(category.image){


    await  deleteCatImage(category.image)
    }
    await Category.findByIdAndDelete(req.params.id);

    res.json({ message: "Category and its products deleted successfully" });
  } catch (err) {
    console.error("Delete category error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateCategory = async(req,res)=>{
  try {
    const {id} = req.params;
    const {name} = req.body;

    const category = await Category.findById(id);


    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    category.name = name;

if(req.file && req.file.path){
  if(category.image){

    await deleteCatImage(category.image)
  }
  category.image= req.file.path;
}

await category.save()
       return res.status(200).json({
      success: true,
      message: "Category updated successfully",
    });

    
  } catch (error) {
     return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
}



exports.getCat_sub = async (req, res) => {
  try {
    const categories = await Category.find();
    const subcats = await SubCategory.find();

    // create map for categories
    const map = {};

    // ✅ Step 1: add all categories with empty subCategories
    categories.forEach((cat) => {
      map[cat._id] = {
        category: cat,
        subCategories: [],
      };
    });

    // ✅ Step 2: attach subcategories
    subcats.forEach((sub) => {
      const catId = sub.category.toString();

      if (map[catId]) {
        map[catId].subCategories.push(sub);
      }
    });

    // ✅ final result
    const result = Object.values(map);

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

