const Pages = require("../models/pagesModel");


const createPagesData = async (req, res) => {
  try {
    const { pageType, heading, des } = req.body;

    if (!pageType || !heading || !des) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const page = await Pages.findOne({ pageType });

    if (page) {
      page.contant.push({ heading, des });
      await page.save();

      return res.status(200).json({
        success: true,
        message: "Content added successfully",
        data: page,
      });
    }

    const newPage = await Pages.create({
      pageType,
      contant: [{ heading, des }],
    });

    return res.status(201).json({
      success: true,
      message: "Page created successfully",
      data: newPage,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



const getPagesData = async (req, res) => {
  try {
    const { pageType } = req.params;

    if (!pageType) {
      return res.status(400).json({
        success: false,
        message: "pageType is required",
      });
    }

    const page = await Pages.findOne({ pageType }).select("contant");

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: page,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const handleDelete = async (req, res) => {
  try {
    const { pageType, contentId } = req.body;

    if (!pageType || !contentId) {
      return res.status(400).json({
        success: false,
        message: "pageType and contentId are required",
      });
    }

    const page = await Pages.findOne({ pageType });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    // const initialLength = page.content.length;

    page.contant = page.contant?.filter(
      (item) => item._id.toString() !== contentId
    );

    // if (page.content.length === initialLength) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Content not found",
    //   });
    // }

    await page.save();

    return res.status(200).json({
      success: true,
      message: "Content deleted successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const editData= async(req,res)=>{
    try {
        const {pageType, heading, des ,editId }= req.body;
if (!pageType) {
      return res.status(400).json({
        success: false,
        message: "pageType is required",
      });
    }

    const page = await Pages.findOne({ pageType });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }
 const contant = page.contant.id(editId);

    if (!contant) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    contant.heading = heading;
    contant.des = des;
      await page.save();

        return res.status(200).json({
      success: true,
      message: "Content updated successfully",
      data: contant,
    });


    } catch (error) {
        console.log(error.message)
           return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
    }
}





module.exports= {createPagesData,getPagesData,handleDelete,editData}


