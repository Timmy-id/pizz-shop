const express = require('express');
const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  updateProductGallery,
  deleteProduct,
  getProductsCount,
  getFeaturedProducts,
} = require('./productController');
const uploadOptions = require('../../helpers/imageUpload');

const router = express.Router();

router.post('/', uploadOptions.single('image'), createProduct);
router.patch(
  '/gallery-images/:productId',
  uploadOptions.array('gallery', 10),
  updateProductGallery
);
router.get('/', getAllProducts);
router.get('/:productId', getProduct);
router.patch('/:productId', updateProduct);
router.delete('/:productId', deleteProduct);
router.get('/get/count', getProductsCount);
router.get('/get/featured', getFeaturedProducts);

module.exports = router;
