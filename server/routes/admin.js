const express = require('express');
const { body, query, validationResult } = require('express-validator');
const House = require('../models/House');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/properties
// @desc    List all properties for moderation
// @access  Private (Admin only)
router.get(
  '/properties',
  [auth, adminOnly],
  [
    query('status')
      .optional()
      .isIn(['all', 'pending', 'approved', 'rejected'])
      .withMessage('Invalid status filter'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
      }

      const { status = 'all', page = 1, limit = 20 } = req.query;
      const filter = {};

      if (status !== 'all') {
        filter.approvalStatus = status;
      }

      const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

      const properties = await House.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10))
        .populate('owner', 'name email phone isVerified')
        .populate('reviewedBy', 'name email');

      const total = await House.countDocuments(filter);

      return res.json({
        properties,
        pagination: {
          current: parseInt(page, 10),
          pages: Math.ceil(total / parseInt(limit, 10)),
          total,
          hasNext: skip + properties.length < total,
          hasPrev: parseInt(page, 10) > 1,
        },
      });
    } catch (error) {
      console.error('Admin list properties error:', error);
      return res.status(500).json({ message: 'Server error while fetching properties' });
    }
  }
);

// @route   PATCH /api/admin/properties/:id/review
// @desc    Approve or reject a property
// @access  Private (Admin only)
router.patch(
  '/properties/:id/review',
  [auth, adminOnly],
  [
    body('action').isIn(['approve', 'reject']).withMessage('Action must be approve or reject'),
    body('note').optional().isString().isLength({ max: 500 }).withMessage('Note must be under 500 characters'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
      }

      const { action, note = '' } = req.body;
      const property = await House.findById(req.params.id);

      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }

      property.approvalStatus = action === 'approve' ? 'approved' : 'rejected';
      property.approvedAt = action === 'approve' ? new Date() : null;
      property.reviewedBy = req.user._id;
      property.reviewNote = note.trim();

      await property.save();

      const updatedProperty = await House.findById(property._id)
        .populate('owner', 'name email phone isVerified')
        .populate('reviewedBy', 'name email');

      return res.json({
        message: action === 'approve' ? 'Property approved successfully' : 'Property rejected successfully',
        property: updatedProperty,
      });
    } catch (error) {
      console.error('Admin review property error:', error);
      if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid property ID' });
      }
      return res.status(500).json({ message: 'Server error while reviewing property' });
    }
  }
);

module.exports = router;
