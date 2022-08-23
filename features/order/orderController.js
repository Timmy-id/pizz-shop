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

  const totalPrices = await Promise.all(
    itemIds.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(
        orderItemId
      ).populate('product', 'price');
      const totalPrice = orderItem.product.price * orderItem.quantity;

      return totalPrice;
    })
  );

  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  let order = new Order({
    orderItems: itemIds,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
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

const updateOrder = async (req, res) => {
  const orderId = req.params.orderId;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res
      .status(400)
      .json({ success: false, message: 'invalid id' });
  }

  try {
    const updateInput = {
      status,
    };

    const order = await Order.findByIdAndUpdate(
      orderId,
      updateInput,
      { new: true }
    );
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: 'order not found' });
    }

    return res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteOrder = async (req, res) => {
  const orderId = req.params.orderId;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res
      .status(400)
      .json({ success: false, message: 'invalid id' });
  }

  Order.findByIdAndRemove(orderId)
    .then(async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItem) => {
          await OrderItem.findByIdAndRemove(orderItem);
        });
        return res.status(200).json({
          success: true,
          message: 'Order deleted successfully',
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: 'Order not found' });
      }
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: err.message });
    });
};

const getTotalSales = async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } },
  ]);

  if (!totalSales) {
    return res.status(400).json({
      success: false,
      message: 'The order sales cannot be generated',
    });
  }
  return res.status(200).json({
    success: true,
    data: totalSales.pop().totalSales,
  });
};

const getOrdersCount = async (req, res) => {
  try {
    const ordersCount = await Order.countDocuments();

    if (!ordersCount) {
      return res
        .status(400)
        .json({ success: false, message: 'invalid request' });
    }

    return res.status(200).json({
      success: true,
      data: ordersCount,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getUserOrders = async (req, res) => {
  const userId = req.params.userId;

  try {
    const userOrders = await Order.find({ user: userId })
      .populate({
        path: 'orderItems',
        populate: { path: 'product', populate: 'category' },
      })
      .sort({ dateOrdered: -1 });

    res.status(200).json({ success: true, data: userOrders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  getTotalSales,
  getOrdersCount,
  getUserOrders,
};
