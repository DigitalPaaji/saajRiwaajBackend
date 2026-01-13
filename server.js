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




const path = require("path")
const app = express()







app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(cors({
    origin: [ process.env.FRONTEND_URL1,process.env.FRONTEND_URL2,
        'http://72.60.201.230:3001'
    ],
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




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


