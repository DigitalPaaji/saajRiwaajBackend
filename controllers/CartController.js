const User = require("../models/UserModel");
const Cart = require("../models/CartModel");
const Product = require("../models/ProductModel");

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
    const { productid, quantity, price,color,buytype } = req.body;
    const userid = req.user._id;

    if (!productid || !quantity || !price) {
      return res.status(400).json({
        success: false,
        message: "Product ID, quantity, and price are required",
      });
    }
    if(buytype=="buy"){
  await Cart.deleteMany({
      user: userid,
      
      buytype
    });

    
await Cart.create({
   user: userid,
      product: productid,
      price,
      quantity,
      color,
      buytype
})


    }
    else{
 const existingCartItem = await Cart.findOne({
      user: userid,
      product: productid,
      color,
      buytype
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
      color, 
      buytype 
    });
    }
    }

   

 
const allCart= await Cart.find({ user: userid,}).populate("product")
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



const getNoUserCart = async(req,res)=>{
  try {
    const {productArry}= req.body;



 if (!productArry || productArry.length === 0) {
      return res.json({ items: [] });
    }

   const productIds = productArry.map(item => item.product);

  
    const products = await Product.find({
      _id: { $in: productIds }
    }).select("price name images colorVariants finalPrice discount offer");

    const productMap = new Map(); 
    products.forEach(p => {
      productMap.set(p._id.toString(), p);
    }); 

    
   const finalProducts = productArry.map(item => {
      const product = productMap.get(item.product);

      if (!product) return null;

      // variant find karo
      const variant = product.colorVariants.find(
        v => v._id.toString() === item.color
      );

      return {
        product: product, 

        price: variant?.price || product.finalPrice || product.price, 

        quantity: item.quantity, // ✅ quantity

        color: item.color, // ✅ colorId

        // optional (useful for frontend)
        selectedVariant: variant || null
      };
    }).filter(Boolean);

    

    return res.json({
      success: true,
      items: finalProducts
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}


module.exports={
    getCart,
    AddtoCart,
    removeFromCart,
    addQuantity,
    getNoUserCart
}


