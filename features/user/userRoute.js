const express = require('express');
const {
  getAllUsers,
  getUser,
  deleteUser,
  getUsersCount,
} = require('./userController');

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:userId', getUser);
router.delete('/:userId', deleteUser);
router.get('/get/count', getUsersCount);

module.exports = router;
