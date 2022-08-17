const mongoose = require('mongoose');
const Order = require('./orderModel');
const OrderItem = require('../orderItem/orderItemModel');

const createOrder = async (req, res) => {
  const orderItemIds = Promise.all(
    req.body.orderItems.map(async (item) => {
      let newOrderItem = new OrderItem({
        quantity: item.quantity,
        product: item.product,
      });
      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    })
  );

  const itemIds = await orderItemIds;

  let order = new Order({
    orderItems: itemIds,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: req.body.totalPrice,
    user: req.body.user,
  });
  order = await order.save();
  if (!order) {
    return res
      .status(400)
      .json({ success: false, data: 'The order cannot be created' });
  }
  res.status(201).json({ success: true, data: order });
};

const getAllOrders = async (req, res) => {
  try {
    const allOrders = await Order.find()
      .populate('user', 'name')
      .sort({ dateOrdered: -1 });

    res.status(200).json({ success: true, data: allOrders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getOrder = async (req, res) => {
  const orderId = req.params.orderId;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res
      .status(400)
      .json({ success: false, message: 'invalid id' });
  }

  try {
    const order = await Order.findById(orderId)
      .populate('user', 'name')
      .populate({
        path: 'orderItems',
        populate: { path: 'product', populate: 'category' },
      });
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: 'order not found' });
    }
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createOrder, getAllOrders, getOrder };
