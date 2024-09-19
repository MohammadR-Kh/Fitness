const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { fullname, username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'Username already exists' });
    }

    user = new User({
      fullname,
      username,
      email,
      password: await bcrypt.hash(password, 10),
    });

    await user.save();

    res.status(201).json({
      msg: 'User registered successfully',
      username: user.username,
      userId: user._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    res.json({
      msg: 'Login successful',
      username: user.username,
      userId: user._id
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(200).json({
      username: user.username,
      fullname: user.fullname,
      weight: user.weight,
      height: user.height
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});
router.put('/:id', async (req, res) => {
  const { weight, height } = req.body;

  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.weight = weight || user.weight;
    user.height = height || user.height;

    await user.save();
    res.status(200).json({
      msg: 'User updated successfully',
      weight: user.weight,
      height: user.height,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});



module.exports = router;