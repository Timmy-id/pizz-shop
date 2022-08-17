const express = require('express');
const {
  getAllOrders,
  createOrder,
  getOrder,
} = require('./orderController');

const router = express.Router();

// router.post('/', createOrder);
router.get('/', getAllOrders);
router.post('/', createOrder);
router.get('/:orderId', getOrder);

module.exports = router;
