const Order = require("../models/OrderModel");
const User = require("../models/UserModel");
const Product = require('../models/ProductModel')

const Cart = require("../models/CartModel");
const axios = require("axios");


const qs= require("querystring")



const getPhonePeToken = async () => {
  const data = qs.stringify({
    client_id: process.env.PHONEPE_CLIENT_ID,
    client_version: process.env.PHONEPE_CLIENT_VERSION,
    client_secret: process.env.PHONEPE_CLIENT_SECRET,
    grant_type: process.env.PHONEPE_GRANT_TYPE
,
  });

  console.log(data)
  const response = await axios.post(
    `${process.env.Sandboxauth}/v1/oauth/token`,
    data,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.access_token;
};
  

 const placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, amount, type } = req.body;
    const userId = req.user._id;

    const productOrder = await Order.create({
      userId,
      items,
      shippingAddress,
      paymentMethod,
      amount,
      paymentStatus: "pending",
      orderStatus: "placed",
    });

    await User.findByIdAndUpdate(userId, { $set: { cart: [] } });

    return res.json({ productOrder, userId });

  } catch (err) {
    console.error("Place order error:", err);
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};



const phonepePay = async (req, res) => {
  try {
    const { orderId, amount, userId } = req.body;
    const AUTH_TOKEN = await getPhonePeToken()

console.log(orderId, amount,AUTH_TOKEN,"asdasdsasasadddd")

const payData ={
 merchantOrderId: orderId,   
      amount: amount * 100,                 
    

      paymentFlow: {
        type: "PG_CHECKOUT", // always required
        merchantUrls: {
          redirectUrl: `${process.env.FRONTEND_URL}/orders`,
        },
      }
}
// const response = await axios.post(`${process.env.Sandbox}/checkout/v2/pay`,payData,{
//   headers :{
//        "Content-Type": "application/json",
//       "Authorization": `O-Bearer ${AUTH_TOKEN}`,
//   }
// })


  // const tokenUrl = response.data.redirectUrl;

    return res.json({
      success: true,
      // tokenUrl,
      orderId,
    });







    
  } catch (error) {
    console.log( error.message);
    return res.status(500).json({ error: error.message });
  }
  
};


 

const phonepeStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
  const userId = req.user._id;
  

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }


        const AUTH_TOKEN = await getPhonePeToken();
   const statusResponse = await axios.get(
      `${process.env.Sandbox}/checkout/v2/order/${orderId}/status?details=true`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `O-Bearer ${AUTH_TOKEN}`,
        },
      }
    );
        const phonePeData = statusResponse.data;

 
if(phonePeData.state=="COMPLETED"){
   order.paymentStatus = "paid";
     await order.save();
      await Cart.deleteMany({ user: userId });
          return res.json({ success: true, message: "Order created" });

}
else if(phonePeData.state=="FAILED"){
  await order.deleteOne()
      return res.json({ success: false, message:"Order falied" });

}


   

   
  

 

  } catch (err) {
    console.log("Error verifying payment:", err);
    res.status(500).json({ success: false, message: "Error verifying payment", error: err.message });
  }
};

const phonePaycancel= async(req,res)=>{
 try {
    const { orderId } = req.params;

    // 1️⃣ Fetch the order from DB
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

  

    // 3️⃣ Save updated order
    await order.deleteOne();

    // 4️⃣ Respond success
    return res.json({ success: true, message: "Payment cancel" });
  } catch (err) {
    console.log("Error verifying payment:", err);
    res.status(500).json({ success: false, message: "Error verifying payment", error: err.message });
  }
}

 




const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 }).populate("items");
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

    order.orderStatus = req.body.orderStatus; 
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
  updateTracking,
  phonepePay,
  phonepeStatus,
  phonePaycancel,
};
