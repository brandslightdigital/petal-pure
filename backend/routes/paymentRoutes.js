// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getOrderDetails } = require('../controllers/PaymentController');

// @route   POST /api/payment/create-order
router.post('/create-order', createOrder);

// @route   POST /api/payment/verify
router.post('/verify', verifyPayment);
// Add this new route
router.get('/:orderId', getOrderDetails);


module.exports = router;
