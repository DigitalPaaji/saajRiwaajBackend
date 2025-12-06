const router = require("express").Router();
const orderController = require("../controllers/OrderController");
const userAuth = require("../middleware/userAuth");
const adminAuth = require("../middleware/adminAuth");

// user routes 
router.post("/", userAuth, orderController.placeOrder); 
router.post("/phonepe/pay", userAuth, orderController.phonepePay);
router.post("/phonepe/status/:orderId", userAuth, orderController.phonepeStatus);
router.post("/phonepe/cancel/:orderId", userAuth, orderController.phonePaycancel);
router.get("/my", userAuth, orderController.getUserOrders);
router.put("/cancel/:id", userAuth, orderController.cancelOrder);
router.get("/", adminAuth, orderController.getAllOrders);
router.get("/:id", adminAuth, orderController.getOrderById);
router.put("/tracking/:id",adminAuth,orderController.updateTracking)

router.put("/:id", adminAuth, orderController.updateOrderStatus);

module.exports = router;
 