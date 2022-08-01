const express = require('express');
const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductsCount,
  getFeaturedProducts,
} = require('./productController');

const router = express.Router();

router.post('/', createProduct);
router.get('/', getAllProducts);
router.get('/:productId', getProduct);
router.patch('/:productId', updateProduct);
router.delete('/:productId', deleteProduct);
router.get('/get/count', getProductsCount);
router.get('/get/featured', getFeaturedProducts);

module.exports = router;
