const mongoose = require('mongoose');
const Category = require('./categoryModel');

const createCategory = async (req, res) => {
  const { name, icon, color } = req.body;

  if (!name)
    return res
      .status(400)
      .json({ success: false, message: 'name is required' });

  const category = new Category({ name, icon, color });

  try {
    await category.save();
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find();

    res.status(200).json({ success: true, data: allCategories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getCategory = async (req, res) => {
  const categoryId = req.params.categoryId;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res
      .status(400)
      .json({ success: false, message: 'invalid id' });
  }

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: 'category not found' });
    }
    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateCategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  const { name, icon, color } = req.body;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res
      .status(400)
      .json({ success: false, message: 'invalid id' });
  }

  try {
    const updateInputs = {
      name,
      icon,
      color,
    };

    const category = await Category.findByIdAndUpdate(
      categoryId,
      updateInputs,
      { new: true }
    );
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: 'category not found' });
    }

    return res.status(200).json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteCategory = async (req, res) => {
  const categoryId = req.params.categoryId;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res
      .status(400)
      .json({ success: false, message: 'invalid id' });
  }

  const category = await Category.findById(categoryId);

  try {
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: 'category not found' });
    } else {
      await category.deleteOne();
      return res.status(200).json({
        success: true,
        message: 'category deleted successfully',
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
};
