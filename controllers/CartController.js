const User = require("../models/UserModel");
const Cart = require("../models/CartModel")

const getCart= async(req,res)=>{
    try {
            const user= req.user._id;
            const cartitem = await Cart.find({user:user}).populate("product");
            



            res.json(cartitem)

    } catch (error) {
        
    }
}

 const AddtoCart = async (req, res) => {
  try {
    const { productid, quantity, price,color } = req.body;
    const userid = req.user._id;

    if (!productid || !quantity || !price) {
      return res.status(400).json({
        success: false,
        message: "Product ID, quantity, and price are required",
      });
    }

    const existingCartItem = await Cart.findOne({
      user: userid,
      product: productid,
      color
    });

    if (existingCartItem) {
      existingCartItem.quantity += quantity;

     

      await existingCartItem.save();
    }else{
  await Cart.create({
      user: userid,
      product: productid,
      price,
      quantity,
      color
    });
    }

 
const allCart= await Cart.find({ user: userid,})
    return res.json({
      success: true,
      message: "Product added to cart",
      cart:allCart
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

 const removeFromCart = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Cart item ID is required",
      });
    }

    const deleted = await Cart.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    return res.json({
      success: true,
      message: "Item removed from cart",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

 const addQuantity = async (req, res) => {
  try {
    const { type } = req.body;
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Cart item ID is required",
      });
    }

    if (!type || !["add", "sub"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action type. Use 'add' or 'sub'.",
      });
    }

    const cartItem = await Cart.findById(id);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    // Update quantity
    if (type === "add") {
      cartItem.quantity += 1;
    } 
    else if (type === "sub") {
      if (cartItem.quantity <= 1) {
       
        await cartItem.deleteOne();

        return res.json({
          success: true,
          message: "Item removed from cart",
        });
      }

      cartItem.quantity -= 1;
    }

    await cartItem.save();

    return res.json({
      success: true,
      message: "Cart quantity updated",
      data: cartItem,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};






module.exports={
    getCart,
    AddtoCart,
    removeFromCart,
    addQuantity
}


