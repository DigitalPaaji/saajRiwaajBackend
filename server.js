const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const Product = require('./routes/productRoutes')
const Tags = require('./routes/TagRoutes')
const Categories = require('./routes/CategoryRoutes')
const SubCategories = require('./routes/SubCategoryRoute')
const bannerRoutes = require('./routes/BannerRoute')
const userRoutes = require('./routes/UserRoutes')  
const couponRoutes = require('./routes/CouponRoutes')
const orderRoutes = require('./routes/OrderRoutes')
const mailRoutes = require("./routes/MailRoutes");
const offerRoutes = require('./routes/OfferRoute')
const cartRoutes = require('./routes/CartRoute')
const pagesRoutes = require('./routes/pagesRoutes')
const NewsletterRoutes = require('./routes/newsLetterRoute')
const wishlistRoutes = require('./routes/wishlistRoute')
const reviewRoutes = require('./routes/reviewRoute')
const http = require("http")



const path = require("path")
const { connectRedis } = require('./helper/redisConfig')
const app = express()

const server = http.createServer(app)


const io = require("socket.io")(server, {
  cors: {
  origin: [ process.env.FRONTEND_URL1,process.env.FRONTEND_URL2,
        'http://72.60.201.230:3001'
    ]
  },
});




app.use("/uploads", express.static(path.join(process.cwd(), "uploads"),
 {
    maxAge: "30d",              
    
    etag: true,                
    lastModified: true,        
    immutable: true            
  }));

app.use(cors({
    origin: [ process.env.FRONTEND_URL1,process.env.FRONTEND_URL2,
        'http://72.60.201.230:3001'
    ],
    // origin:"*",
     methods: ["GET", "POST", "PUT", "DELETE"],
    credentials:true,
}))

app.use("/uploads",express.static(path.join(process.cwd(),"uploads")));

app.use(express.json())
app.use(cookieParser())

mongoose.connect(process.env.MONGO_URI).then(()=> console.log('MongoDB Connected')).catch(err=>console.log('Connection Error',err))

app.get('/',(req,res)=>{
    res.send('Saaj Riwaaj Backend Running!')
})

app.get('/ping',(req,res)=>{
    res.send('pong')
})


app.use('/product',Product) 
app.use('/tag',Tags)
app.use('/category',Categories)
app.use('/subcategory',SubCategories)
app.use('/banner', bannerRoutes); 
app.use('/user',userRoutes)
app.use('/coupon',couponRoutes)
app.use('/order',orderRoutes);
app.use("/api", mailRoutes); 
app.use('/offer', offerRoutes);
app.use("/cart",cartRoutes) 
app.use("/pages",pagesRoutes)
app.use("/newsletter",NewsletterRoutes) 
app.use("/wishlist",wishlistRoutes)
app.use("/review",reviewRoutes)









const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  connectRedis()
});


const productViewers = {}


io.on("connection",(socket)=>{

  socket.on("joinProduct", (productId) => {
    socket.join(productId);

    if (!productViewers[productId]) {
      productViewers[productId] = new Set();
    }

    productViewers[productId].add(socket.id);

    io.to(productId).emit("viewerCount", productViewers[productId].size);
  });

  socket.on("leaveProduct", (productId) => {
    socket.leave(productId);

    if (productViewers[productId]) {
      productViewers[productId].delete(socket.id);

      io.to(productId).emit("viewerCount", productViewers[productId].size);
    }
  });

  socket.on("disconnect", () => {
    // remove from all rooms
    for (let productId in productViewers) {
      productViewers[productId].delete(socket.id);

      io.to(productId).emit("viewerCount", productViewers[productId].size);
    }
  });
})

