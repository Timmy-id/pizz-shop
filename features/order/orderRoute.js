const express = require('express');
const {
  getAllOrders,
  createOrder,
  getOrder,
  updateOrder,
  deleteOrder,
} = require('./orderController');

const router = express.Router();

// router.post('/', createOrder);
router.get('/', getAllOrders);
router.post('/', createOrder);
router.get('/:orderId', getOrder);
router.patch('/:orderId', updateOrder);
router.delete('/:orderId', deleteOrder);

module.exports = router;
