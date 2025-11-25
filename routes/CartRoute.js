const express  = require("express");
const { getCart, AddtoCart, removeFromCart, addQuantity } = require("../controllers/CartController");
const userAuth = require("../middleware/userAuth");
const router = express.Router();

router.get("/get",userAuth,getCart)
router.post("/post",userAuth,AddtoCart)
router.delete("/destroy/:id",userAuth,removeFromCart)
router.put("/update/:id",userAuth,addQuantity)

module.exports =router
 




