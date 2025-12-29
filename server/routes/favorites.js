const express = require('express');
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const House = require('../models/House');

const router = express.Router();

// @route   GET /api/favorites/ids
// @desc    Get IDs of current user's favorite houses
// @access  Private
router.get('/ids', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('favorites');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const favorites = (user.favorites || []).map((id) => id.toString());

    return res.json({ favorites });
  } catch (error) {
    console.error('Get favorite ids error:', error);
    return res.status(500).json({ message: 'Server error while fetching favorite ids' });
  }
});

// @route   GET /api/favorites
// @desc    Get full favorite house documents for current user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('favorites');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const favoriteIds = user.favorites || [];

    if (!favoriteIds.length) {
      return res.json({ houses: [] });
    }

    const houses = await House.find({
      _id: { $in: favoriteIds },
      isActive: true,
    });

    return res.json({ houses });
  } catch (error) {
    console.error('Get favorites error:', error);
    return res.status(500).json({ message: 'Server error while fetching favorites' });
  }
});

// @route   POST /api/favorites/:houseId
// @desc    Add a house to current user's favorites
// @access  Private
router.post('/:houseId', auth, async (req, res) => {
  try {
    const { houseId } = req.params;

    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).json({ message: 'House not found' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { favorites: houseId } },
      { new: true }
    ).select('favorites');

    const favorites = (user.favorites || []).map((id) => id.toString());

    return res.json({ favorites });
  } catch (error) {
    console.error('Add favorite error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid house ID' });
    }
    return res.status(500).json({ message: 'Server error while adding favorite' });
  }
});

// @route   DELETE /api/favorites/:houseId
// @desc    Remove a house from current user's favorites
// @access  Private
router.delete('/:houseId', auth, async (req, res) => {
  try {
    const { houseId } = req.params;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { favorites: houseId } },
      { new: true }
    ).select('favorites');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const favorites = (user.favorites || []).map((id) => id.toString());

    return res.json({ favorites });
  } catch (error) {
    console.error('Remove favorite error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid house ID' });
    }
    return res.status(500).json({ message: 'Server error while removing favorite' });
  }
});

module.exports = router;
