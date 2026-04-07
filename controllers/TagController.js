const deleteCatImage = require('../helper/deleteCatImg');
const ProductModel = require('../models/ProductModel');
const Tag = require('../models/TagModel');

exports.createTag = async (req, res) => {
    try {
const image = req.file.path


        const tag = await Tag.create({ name: req.body.name,image });
         res.status(200).json({ message: "Tag Created" }); 
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

       const tag=  await Tag.findById(tagId);
  
 if(!tag){
 return   res.status(400).json({ message: "Tag Not Found" });
 }

    await ProductModel.updateMany(
      { tags: tagId },               
      { $pull: { tags: tagId } }    
    );


    if(tag.image){
         await deleteCatImage(tag.image)
     
    }
await tag.deleteOne()
    res.status(200).json({ message: "Tag deleted" });
  } catch (err) {
    console.error("Error deleting tag:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.editTag = async (req, res) => {
  try {
    const { name } = req.body;
    const id = req.params.id;

    const findTag = await Tag.findById(id);

    if (!findTag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    // ✅ Update name only if provided
    if (name) {
      findTag.name = name;
    }

    if (req.file && req.file.path) {
      if (findTag.image) {
        try {
          await deleteCatImage(findTag.image);
        } catch (err) {
          console.log("Image delete error:", err.message);
        }
      }

      // Normalize path (important on Windows)
      findTag.image = req.file.path;
    }

    await findTag.save();

    return res.status(200).json({
      success: true,
      message: "Tag updated successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.ToggleStatus = async(req,res)=>{
  try {
    const {id} = req.params
    const getTag = await Tag.findById(id);
    if(!getTag){
      return res.json({success:false,message:"Tag not found"})}


      getTag.status= !getTag.status;

await getTag.save()

return res.status(200).json({
  success:true,
  message:"Updated SuccessFully"
})

  } catch (error) {
 return res.status(500).json({success:false,message:error.message})
  }
}

exports.getTagsToggle= async(req,res)=>{
  try {
    const tags = await Tag.find({status:true})
   
    res.status(200).json({ tags,success:true})

  } catch (error) {
    res.status(500).json({success:false,message:error.message})
  }
}



exports.getProduct= async (req,res)=>{
  try {
    const {tagid} = req.params

     const page = parseInt(req.query.page) || 1;
    const limit = 16;
    const skip = (page - 1) * limit;

      const products = await ProductModel.find({
  tags: { $in: [tagid] }
}).skip(skip)
          .limit(limit)
            .populate('category','name')
            .populate('tags','name')
            .populate('subcategory','name').lean();
            
 const total = await ProductModel.countDocuments(filter);
        res.status(200).json({products,
          pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }})
  } catch (error) {
         res.status(500).json({error:err.message})
  }
}



