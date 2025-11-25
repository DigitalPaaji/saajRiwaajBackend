const Order = require("../models/OrderModel");
const User = require("../models/UserModel");
const Product = require('../models/ProductModel')
const Razorpay  = require("razorpay")
const crypto = require("crypto")
// USER: Place an order
const placeOrder = async (req, res) => { 
  try {
    const { items, shippingAddress, paymentMethod, amount,type } = req.body;
    const userId = req.user._id;

    if(type !="paynow"){
  const instance = new Razorpay({
key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,

  })
 

      const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

 
    const order = await instance.orders.create(options);

  const productOrder= await Order.create({
      userId,
      items,
      shippingAddress,
      paymentMethod,
      amount,
      paymentStatus:  "pending",
      orderStatus: "placed"
    });

    await User.findByIdAndUpdate(userId, { $set: { cart: [] } });




     return  res.json({order,productOrder});
    }
    else{

 const instance = new Razorpay({
key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,

  })


    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await instance.orders.create(options);
  
return  res.json(order);





    }
  
  } catch (err) {
    console.error("Place order error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
 


const verifyorder= async(req,res)=>{
  try {
     const { razorpay_order_id, razorpay_payment_id, razorpay_signature,productId } = req.body;
     
  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

    
      if (razorpay_signature === expectedSign) {
    const order = await Order.findById(productId)
    order.paymentStatus= "paid";
     await order.save();

    return res.json({ success: true });
  } else {
    return res.json({ success: false });
  }

  } catch (error) {
        return res.json({ success: false,error:error.message });

  }
}






const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};


const cancelOrder = async (req, res) => {
  try {
    const {finalReason} = req.body;
    const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.orderStatus === "placed") {
      order.orderStatus = "cancelled";
      order.cancelreason= finalReason
      await order.save();
      return res.status(200).json({ message: "Order cancelled", order });
    } else {
      return res.status(400).json({ message: "Order cannot be cancelled now" });
    }
  } catch (err) {
    res.status(500).json({ message: "Cancellation failed",error:err.message });
  }
};


const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate("userId").populate("items.product");
        // await orders.populate("items.product.category")
      
    const user = await User.find();
    const product = await Product.find().populate("category");
           res.status(200).json({ orders,product,user }); 
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email phone address")
      .populate("items.product");

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Normalize phone field (fallback for old docs)
    const userPhone = order.userId?.phone || order.userId?.address?.phone || "";

    res.status(200).json({ order: { ...order.toObject(), userPhone } });
  } catch (err) {
    console.error("Get order by ID error:", err);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};



const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = req.body.orderStatus; // e.g. shipped/delivered
    await order.save();
    res.status(200).json({ message: "Status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Error updating status" });
  }
};


const updateTracking = async (req, res) => {
  try {
    const { id } = req.params;
    const { info,type } = req.body;
     if (!info) {
      return res.status(400).json({success:false, message: "Tracking number is required" });
    }
    const order = await Order.findById(id);
     if (!order) {
      return res.status(404).json({ success:false, message: "Order not found" });
    }

    
if(type=="tracking"){
   

    
   

    order.trackingnumber = info;
    await order.save();

    res.status(200).json({
      success:true,
      message: "Tracking number updated successfully",

    });
  }

else if(type=="payment"){
 order.paymentStatus = info;
    await order.save();

    res.status(200).json({
      success:true,
      message: "Payment Status updated successfully",

    });
}
else if(type=="order"){
  
  order.orderStatus = info;
    await order.save();

    res.status(200).json({
      success:true,
      message: "Order Status updated successfully",

    });
}

  } catch (error) {
    res.status(500).json({success:false, message: error.message, error: error.message });
  }
};




module.exports = {
  placeOrder,  
  getUserOrders,
  cancelOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  verifyorder,
  updateTracking
};
