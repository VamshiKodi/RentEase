const express = require('express');
const mongoose = require('mongoose');
const { auth } = require('../middleware/auth');
const Review = require('../models/Review');
const House = require('../models/House');

const router = express.Router();

const getReviewStats = async (propertyId) => {
  const objectId = new mongoose.Types.ObjectId(propertyId);

  const stats = await Review.aggregate([
    { $match: { property: objectId } },
    {
      $group: {
        _id: '$property',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (!stats.length) {
    return { averageRating: null, totalReviews: 0 };
  }

  return {
    averageRating: Number(stats[0].averageRating.toFixed(1)),
    totalReviews: stats[0].totalReviews,
  };
};

// Get reviews for a property
router.get('/property/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid property ID' });
    }

    const reviews = await Review.find({ property: id })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    const stats = await getReviewStats(id);

    return res.json({
      reviews,
      averageRating: stats.averageRating,
      totalReviews: stats.totalReviews,
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    return res.status(500).json({ message: 'Server error while fetching reviews' });
  }
});

// Create or update a review for a property
router.post('/property/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid property ID' });
    }

    const numericRating = Number(rating);
    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const house = await House.findById(id).select('owner');
    if (!house) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Prevent owner from reviewing own property
    if (house.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Owners cannot review their own property' });
    }

    const update = {
      property: house._id,
      owner: house.owner,
      user: req.user._id,
      rating: numericRating,
      comment: comment?.trim() || '',
    };

    let review = await Review.findOne({ property: house._id, user: req.user._id });

    if (review) {
      review.rating = update.rating;
      review.comment = update.comment;
      await review.save();
    } else {
      review = new Review(update);
      await review.save();
    }

    const stats = await getReviewStats(house._id.toString());

    const populatedReview = await Review.findById(review._id).populate('user', 'name');

    return res.status(201).json({
      review: populatedReview,
      averageRating: stats.averageRating,
      totalReviews: stats.totalReviews,
    });
  } catch (error) {
    console.error('Create/update review error:', error);

    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this property' });
    }

    return res.status(500).json({ message: 'Server error while saving review' });
  }
});

module.exports = router;
