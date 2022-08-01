const express = require('express');
const { getAllUsers, getUser } = require('./userController');

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:userId', getUser);

module.exports = router;
