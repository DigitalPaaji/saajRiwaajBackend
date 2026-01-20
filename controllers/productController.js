const deleteImage = require('../helper/deleteImage');
const OfferModel = require('../models/OfferModel')
const Product = require('../models/ProductModel')
const SubCategoryModel = require('../models/SubCategoryModel')

exports.createProduct = async (req,res)=>{
    try{

const data= req.body;
let images= req.files.images;
let allImges=[]
images.forEach((item)=>{
allImges.push(item.filename)
})
let fullbarcode = req.files.barcode

let barcode = ""

if(fullbarcode){
  
fullbarcode.forEach((item)=>{
barcode = item.filename
})

}
 const description = JSON.parse(req.body.description);
  const tags = JSON.parse(req.body.tags);
  const colorVariants = JSON.parse(req.body.colorVariants);

  const isFeatured = req.body.isFeatured === "true";
  const isNewArrival = req.body.isNewArrival === "true";
  const allproductData = {...req.body,description,tags,colorVariants,isFeatured,isNewArrival,images:allImges,barcode}
        const newProduct = new Product(allproductData)
        const saved = await newProduct.save()
        res.status(200).json({saved,fullbarcode})
    }catch(err){
        res.status(500).json({error:err.message})
    }
}

exports.getAllProducts = async (req,res)=>{
    try{
        const products = await Product.find()
        .populate('category','name')
        .populate('tags','name')
        .populate('subcategory','name')
        res.status(200).json({products})
    }
    catch(err){
        res.status(500).json({error:err.message})
    }
}

exports.getProductById = async (req,res)=>{
      try{
        const product = await Product.findById(req.params.id)
      // .populate('category', 'name')
      // .populate('tags', 'name')
   

        if(!product) return res.status(404).json({message:'Not Found'})
        res.status(200).json(product)
    }
    catch(err){ 
        res.status(500).json({error:err.message})
        
    }
}

exports.getProductsByCategory = async (req, res) => {
  try {
 const productsRaw = await Product.aggregate([
  { $match: { category: mongoose.Types.ObjectId(req.params.categoryId) } },
  { $sample: { size: 15 } }, // randomly select 15 documents
]);

// Then populate category and subcategory
const products = await Product.populate(productsRaw, [
  { path: "category", select: "name" },
  { path: "subcategory", select: "name" },
]);

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductsByOffer = async (req, res) => {
 
  try {
    const offerId = req.params.offerId;

    
    const products = await Product.find({ offer: offerId }).populate("offer");

    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error fetching products for this offer" });
  }
};

exports.deleteProductById = async (req,res)=>{
      try{
        const deleted = await Product.findByIdAndDelete(req.params.id)
        if(!deleted) return res.status(404).json({message:'Not Found'})
        res.status(200).json({message:'Product Deleted Successfully'})
    }
    catch(err){
        res.status(500).json({error:err.message})
    }
}

exports.updateProductById = async (req, res) => {
 try {
    /* ------------------ Parse JSON fields ------------------ */
    const parse = (v, fallback) => {
      try {
        return v ? JSON.parse(v) : fallback;
      } catch {
        return fallback;
      }
    };

    req.body.description   = parse(req.body.description, {});
    req.body.offer         = parse(req.body.offer, []);
    req.body.tags          = parse(req.body.tags, []);
    req.body.colorVariants = parse(req.body.colorVariants, []);
    req.body.hidethings    = parse(req.body.hidethings, []);
    req.body.images        = parse(req.body.images, []);
    const deleteImages     = parse(req.body.deleteImage, []);

    req.body.isFeatured    = req.body.isFeatured === "true";
    req.body.isNewArrival  = req.body.isNewArrival === "true";
    req.body.deleteBarcode = req.body.deleteBarcode === "true";

    /* ------------------ Category validation ------------------ */
    const { category, subcategory } = req.body;

    if (category) {
      const subcategories = await SubCategoryModel.find({ category });

      if (!subcategories.length) {
        req.body.subcategory = null;
      } else {
        const isValidSub = subcategories.some(
          (s) => String(s._id) === String(subcategory)
        );
        if (!isValidSub) req.body.subcategory = null;
      }
    }

    /* ------------------ Fetch product ------------------ */
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    /* ------------------ Delete old product images ------------------ */
    if (deleteImages.length) {
      deleteImages.forEach((filename) =>  deleteImage(filename));
    }

    /* ------------------ Add new images ------------------ */
    if (req.files?.newImages) {
      const uploadedImages = req.files.newImages.map((f) => f.filename);
      req.body.images = [...req.body.images, ...uploadedImages];
    }

    /* ------------------ Barcode delete / replace ------------------ */
    if (req.body.deleteBarcode && product.barcode) {
      deleteImage(product.barcode);
      req.body.barcode = null;
    }

    if (req.files?.newBarCode?.[0]) {
      if (product.barcode) deleteImage(product.barcode);
      req.body.barcode = req.files.newBarCode[0].filename;
    }

    /* ------------------ Update product ------------------ */
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updated);

  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true })
      .populate('category', 'name')
      .populate('tags', 'name')
      .populate('subcategory', 'name')
      .sort({ createdAt: -1 });
      res.status(200).json(featuredProducts);
  } catch (err) {
    console.error("Error fetching featured products:", err);
    res.status(500).json({ error: err.message });
  }
};
