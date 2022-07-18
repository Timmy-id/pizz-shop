const mongoose = require('mongoose');
const Product = require('./productModel');
const Category = require('../category/categoryModel');

const createProduct = async (req, res) => {
  const {
    name,
    shortDescription,
    longDescription,
    image,
    brand,
    price,
    category,
    stock,
    rating,
    numReviews,
    isFeatured,
  } = req.body;

  const productCategory = await Category.findById(category);

  if (!productCategory) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid category' });
  }

  if (!name || !shortDescription || !category || !stock) {
    return res.status(400).json({
      success: false,
      message:
        'name or short description or category or stock is required',
    });
  }

  const product = new Product({
    name,
    shortDescription,
    longDescription,
    image,
    brand,
    price,
    category,
    stock,
    rating,
    numReviews,
    isFeatured,
  });

  try {
    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find().select(
      'name image -_id'
    );

    res.status(200).json({ success: true, data: allProducts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getProduct = async (req, res) => {
  const productId = req.params.productId;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res
      .status(400)
      .json({ success: false, message: 'invalid id' });
  }

  try {
    const product = await Product.findById(productId).populate(
      'category'
    );
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'product not found' });
    }
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  const productId = req.params.productId;
  const {
    name,
    shortDescription,
    longDescription,
    image,
    brand,
    price,
    category,
    stock,
    rating,
    numReviews,
    isFeatured,
  } = req.body;

  const productCategory = await Category.findById(category);

  if (!productCategory) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid category' });
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res
      .status(400)
      .json({ success: false, message: 'invalid id' });
  }

  try {
    const updateInputs = {
      name,
      shortDescription,
      longDescription,
      image,
      brand,
      price,
      category,
      stock,
      rating,
      numReviews,
      isFeatured,
    };

    const product = await Product.findByIdAndUpdate(
      productId,
      updateInputs,
      { new: true }
    );
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'product not found' });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  const productId = req.params.productId;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res
      .status(400)
      .json({ success: false, message: 'invalid id' });
  }

  const product = await Product.findById(productId);

  try {
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'product not found' });
    } else {
      await Product.deleteOne();
      return res.status(200).json({
        success: true,
        message: 'product deleted successfully',
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct
};
