const express = require('express');
const {
  getAllOrders,
  createOrder,
  getOrder,
  updateOrder,
  deleteOrder,
  getTotalSales,
  getOrdersCount,
  getUserOrders,
} = require('./orderController');

const router = express.Router();

// router.post('/', createOrder);
router.get('/', getAllOrders);
router.post('/', createOrder);
router.get('/:orderId', getOrder);
router.patch('/:orderId', updateOrder);
router.delete('/:orderId', deleteOrder);
router.get('/get/totalsales', getTotalSales);
router.get('/get/count', getOrdersCount);
router.get('/get/user-orders/:userId', getUserOrders);

module.exports = router;
