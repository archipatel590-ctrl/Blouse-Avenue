import express from 'express';

const router = express.Router();

// @desc    Test connection
// @route   GET /api/test
// @access  Public
router.get('/', (req, res) => {
  res.json({ message: 'API is running successfully!' });
});

export default router;
