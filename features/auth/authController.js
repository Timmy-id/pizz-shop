const mongoose = require('mongoose');
const User = require('../user/userModel');
const bcrypt = require('bcryptjs');
const generateToken = require('../../utils/generateToken');

const registerUser = async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    isAdmin,
    street,
    house_number,
    zip,
    city,
    country,
  } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  if (!name || !email || !password || !phone)
    return res
      .status(400)
      .json({ success: false, message: 'Required field(s) missing' });

  const user = new User({
    name,
    email,
    password: hashedPassword,
    phone,
    isAdmin,
    street,
    house_number,
    zip,
    city,
    country,
  });

  try {
    await user.save();
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json('User not found');
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    const token = generateToken(user.id);
    user.token = token;

    res
      .status(200)
      .json({
        success: true,
        data: { email: user.email, token: user.token },
      });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
