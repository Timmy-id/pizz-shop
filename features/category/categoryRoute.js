const express = require('express');
const {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} = require('./categoryController');

const router = express.Router();

router.post('/', createCategory);
router.get('/', getAllCategories);
router.get('/:categoryId', getCategory);
router.patch('/:categoryId', updateCategory);
router.delete('/:categoryId', deleteCategory);

module.exports = router;
