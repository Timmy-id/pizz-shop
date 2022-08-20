const mongoose = require('mongoose');
const Product = require('./productModel');
const Category = require('../category/categoryModel');

const createProduct = async (req, res) => {
  const productCategory = await Category.findById(req.body.category);

  if (!productCategory) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid category' });
  }

  const file = req.file;

  if (!file) {
    return res
      .status(400)
      .json({ success: false, message: 'Image field is required' });
  }

  const fileName = req.file.filename;

  const basePath = `${req.protocol}://${req.get(
    'host'
  )}/public/uploads/`;

  const product = new Product({
    name: req.body.name,
    shortDescription: req.body.shortDescription,
    longDescription: req.body.longDescription,
    image: `${basePath}${fileName}`,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    stock: req.body.stock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
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
    let filter = {};

    if (req.query.categories) {
      filter = { category: req.query.categories.split(',') };
    }
    const allProducts = await Product.find(filter).populate(
      'category'
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

const updateProductGallery = async (req, res) => {
  const productId = req.params.productId;
  const gallery = req.body;
  const files = req.files;
  const basePath = `${req.protocol}://${req.get(
    'host'
  )}/public/uploads/`;
  let galleryPaths = [];

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res
      .status(400)
      .json({ success: false, message: 'invalid id' });
  }

  if (files) {
    files.map((file) => {
      galleryPaths.push(`${basePath}${file.fileName}`);
    });
  }

  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      { gallery: galleryPaths },
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

const getProductsCount = async (req, res) => {
  try {
    const productsCount = await Product.countDocuments();

    if (!productsCount) {
      return res
        .status(400)
        .json({ success: false, message: 'invalid request' });
    }

    return res.status(200).json({
      success: true,
      data: productsCount,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const count = req.query.count;
    const featuredProducts = await Product.find({
      isFeatured: true,
    }).limit(+count);

    res.status(200).json({ success: true, data: featuredProducts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  updateProductGallery,
  deleteProduct,
  getProductsCount,
  getFeaturedProducts,
};
