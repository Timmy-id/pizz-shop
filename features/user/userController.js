const mongoose = require('mongoose');
const User = require('./userModel');

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find().select('-password');

    res.status(200).json({ success: true, data: allUsers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getUser = async (req, res) => {
  const userId = req.params.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res
      .status(400)
      .json({ success: false, message: 'invalid id' });
  }

  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'user not found' });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res
      .status(400)
      .json({ success: false, message: 'invalid id' });
  }

  const user = await User.findById(userId);

  try {
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'user not found' });
    } else {
      await user.deleteOne();
      return res.status(200).json({
        success: true,
        message: 'user deleted successfully',
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUsersCount = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();

    if (!usersCount) {
      return res
        .status(400)
        .json({ success: false, message: 'invalid request' });
    }

    return res.status(200).json({
      success: true,
      data: usersCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllUsers, getUser, deleteUser, getUsersCount };
