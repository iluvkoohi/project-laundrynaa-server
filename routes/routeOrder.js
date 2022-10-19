const express = require("express");
const router = express.Router();

const order = require("../controllers/order/orderController");
const sale = require("../controllers/order/salesController");
const preference = require("../controllers/order/preferenceController");

router.post("/order", (req, res) => order.createOrder(req, res));
router.get("/order/s/:id", (req, res) => order.getOrderById(req, res));
router.get("/order/get-by-customer", (req, res) => order.getOrdersByCustomer(req, res));
router.get("/order/get-by-laundry", (req, res) => order.getOrdersByLaundry(req, res));
router.put("/order/update/payment-status", (req, res) => order.updateOrderPaymentStatus(req, res));
router.put("/order/update/order-status", (req, res) => order.updateOrderStatus(req, res));

// SALES
router.get("/sales/get-by-laundry", (req, res) => sale.getSalesByLaundry(req, res));
router.get("/sales/get-by-customer", (req, res) => sale.getSalesByCustomer(req, res));

// PREFERENCES
router.post("/preference", (req, res) => preference.createPreference(req, res));
router.get("/preference", (req, res) => preference.getPreferences(req, res));
router.put("/preference", (req, res) => preference.updatePreferences(req, res));
router.delete("/preference/:id", (req, res) => preference.deletePreferences(req, res));

module.exports = router;



