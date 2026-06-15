import express from 'express';
import User from '../models/User.js';

const router = express.Router();


// @desc    Get all users
// @route   GET /api/users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Log in / register user
// @route   POST /api/users/login
router.post('/login', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // 1. Admin login credentials bypass
    if (email === 'zuri@admin.com') {
      if (password === 'zuri@2106') {
        // Find if admin is already registered in DB, otherwise add them
        let adminUser = await User.findOne({ email: 'zuri@admin.com' });
        if (!adminUser) {
          adminUser = await User.create({
            name: 'Brand Admin',
            email: 'zuri@admin.com',
            isAdmin: true,
            phone: '+91 99999 88888',
            city: 'New Delhi, DL',
            address: 'Zuri Couture Studio, Connaught Place',
            favorites: ['w1', 'w2', 'w3', 'w4']
          });
        }
        return res.json({
          name: adminUser.name,
          email: adminUser.email,
          isAdmin: adminUser.isAdmin,
          phone: adminUser.phone,
          city: adminUser.city,
          address: adminUser.address,
          favorites: adminUser.favorites,
          loggedIn: true
        });
      } else {
        return res.status(401).json({ message: 'Invalid Admin Password' });
      }
    }

    // 2. Normal customer login (registers if not found, mimicking mock auth)
    let user = await User.findOne({ email });
    if (!user) {
      // Create user
      user = await User.create({
        name: name || 'Valued Customer',
        email,
        isAdmin: false,
        phone: '+91 98765 43210',
        city: 'Bengaluru, KA',
        address: '42, 8th Main Road, Indiranagar',
        favorites: ['w1', 'w2']
      });
    }

    res.json({
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      phone: user.phone,
      city: user.city,
      address: user.address,
      favorites: user.favorites,
      loggedIn: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update user favorites (toggle product ID)
// @route   POST /api/users/favorites
router.post('/favorites', async (req, res) => {
  const { email, productId } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const index = user.favorites.indexOf(productId);
      if (index > -1) {
        user.favorites.splice(index, 1);
      } else {
        user.favorites.push(productId);
      }
      await user.save();
      res.json({ success: true, favorites: user.favorites });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update user profile details
// @route   PUT /api/users/profile
router.put('/profile', async (req, res) => {
  const { email, phone, city, address } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.phone = phone || user.phone;
      user.city = city || user.city;
      user.address = address || user.address;
      await user.save();
      res.json({
        success: true,
        phone: user.phone,
        city: user.city,
        address: user.address
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
