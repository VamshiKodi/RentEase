const express = require('express');
const { body, validationResult, query } = require('express-validator');
const House = require('../models/House');
const { auth, ownerOnly } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/houses
// @desc    Get all houses with filters and search
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1-50'),
  query('minRent').optional().isInt({ min: 0 }).withMessage('Min rent must be non-negative'),
  query('maxRent').optional().isInt({ min: 0 }).withMessage('Max rent must be non-negative'),
  query('bhk').optional().isIn(['1RK', '1BHK', '2BHK', '3BHK', '4BHK', '5BHK+']).withMessage('Invalid BHK value'),
  query('furnishing').optional().isIn(['Fully Furnished', 'Semi Furnished', 'Unfurnished']).withMessage('Invalid furnishing value'),
  query('propertyType').optional().isIn(['Apartment', 'House', 'Villa', 'Studio', 'Penthouse']).withMessage('Invalid property type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const {
      page = 1,
      limit = 12,
      search,
      city,
      minRent,
      maxRent,
      bhk,
      furnishing,
      propertyType,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true, availability: 'Available' };

    // Search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } }
      ];
    }

    // City filter
    if (city) {
      filter['location.city'] = { $regex: city, $options: 'i' };
    }

    // Rent range filter
    if (minRent || maxRent) {
      filter.rent = {};
      if (minRent) filter.rent.$gte = parseInt(minRent);
      if (maxRent) filter.rent.$lte = parseInt(maxRent);
    }

    // Other filters
    if (bhk) filter.bhk = bhk;
    if (furnishing) filter.furnishing = furnishing;
    if (propertyType) filter.propertyType = propertyType;

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const houses = await House.find(filter)
      .populate('owner', 'name email phone isVerified')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await House.countDocuments(filter);

    res.json({
      houses,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        hasNext: skip + houses.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get houses error:', error);
    res.status(500).json({ message: 'Server error while fetching houses' });
  }
});

router.get('/nearby', [
  query('lat').isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  query('lng').isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  query('maxDistanceKm').optional().isFloat({ min: 1, max: 50 }).withMessage('maxDistanceKm must be between 1 and 50')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { lat, lng, maxDistanceKm = 10 } = req.query;
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const maxDistanceMeters = parseFloat(maxDistanceKm) * 1000;

    const houses = await House.find({
      isActive: true,
      availability: 'Available',
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: maxDistanceMeters
        }
      }
    })
      .populate('owner', 'name email phone isVerified')
      .limit(50);

    return res.json({
      houses,
      meta: {
        maxDistanceKm: parseFloat(maxDistanceKm),
        total: houses.length
      }
    });
  } catch (error) {
    console.error('Get nearby houses error:', error);
    return res.status(500).json({ message: 'Server error while fetching nearby houses' });
  }
});

// @route   POST /api/houses/:id/contact-event
// @desc    Track a contact action (phone, email, whatsapp) for analytics
// @access  Public
router.post('/:id/contact-event', async (req, res) => {
  try {
    const { type } = req.body;

    const house = await House.findById(req.params.id).select('_id');
    if (!house) {
      return res.status(404).json({ message: 'House not found' });
    }

    const incUpdate = {
      'contactStats.total': 1
    };

    if (type === 'whatsapp') {
      incUpdate['contactStats.whatsapp'] = 1;
    } else if (type === 'phone') {
      incUpdate['contactStats.phone'] = 1;
    } else if (type === 'email') {
      incUpdate['contactStats.email'] = 1;
    }

    await House.updateOne({ _id: house._id }, { $inc: incUpdate });

    return res.json({ message: 'Contact event tracked' });
  } catch (error) {
    console.error('Track contact event error:', error);
    return res.status(500).json({ message: 'Server error while tracking contact event' });
  }
});

// @route   GET /api/houses/:id
// @desc    Get single house by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const house = await House.findById(req.params.id)
      .populate('owner', 'name email phone isVerified');

    if (!house) {
      return res.status(404).json({ message: 'House not found' });
    }

    // Increment view count
    house.views += 1;
    await house.save();

    res.json(house);
  } catch (error) {
    console.error('Get house error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid house ID' });
    }
    res.status(500).json({ message: 'Server error while fetching house' });
  }
});

// @route   POST /api/houses
// @desc    Create a new house listing
// @access  Private (Owner only)
router.post('/', [auth, ownerOnly], [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5-100 characters'),
  body('description').trim().isLength({ min: 20, max: 1000 }).withMessage('Description must be between 20-1000 characters'),
  body('location.address').notEmpty().withMessage('Address is required'),
  body('location.city').notEmpty().withMessage('City is required'),
  body('location.state').notEmpty().withMessage('State is required'),
  body('location.pincode').matches(/^[0-9]{6}$/).withMessage('Please enter a valid 6-digit pincode'),
  body('rent').isInt({ min: 1 }).withMessage('Rent must be a positive number'),
  body('deposit').optional().isInt({ min: 0 }).withMessage('Deposit must be non-negative'),
  body('bhk').isIn(['1RK', '1BHK', '2BHK', '3BHK', '4BHK', '5BHK+']).withMessage('Invalid BHK value'),
  body('furnishing').isIn(['Fully Furnished', 'Semi Furnished', 'Unfurnished']).withMessage('Invalid furnishing value'),
  body('area').isInt({ min: 1 }).withMessage('Area must be a positive number'),
  body('propertyType').isIn(['Apartment', 'House', 'Villa', 'Studio', 'Penthouse']).withMessage('Invalid property type'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const houseData = {
      ...req.body,
      owner: req.user._id
    };

    const house = new House(houseData);
    await house.save();

    const populatedHouse = await House.findById(house._id)
      .populate('owner', 'name email phone isVerified');

    res.status(201).json({
      message: 'House listing created successfully',
      house: populatedHouse
    });
  } catch (error) {
    console.error('Create house error:', error);
    res.status(500).json({ message: 'Server error while creating house listing' });
  }
});

// @route   PUT /api/houses/:id
// @desc    Update house listing
// @access  Private (Owner only - own listings)
router.put('/:id', [auth, ownerOnly], [
  body('title').optional().trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5-100 characters'),
  body('description').optional().trim().isLength({ min: 20, max: 1000 }).withMessage('Description must be between 20-1000 characters'),
  body('rent').optional().isInt({ min: 1 }).withMessage('Rent must be a positive number'),
  body('deposit').optional().isInt({ min: 0 }).withMessage('Deposit must be non-negative'),
  body('area').optional().isInt({ min: 1 }).withMessage('Area must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const house = await House.findById(req.params.id);

    if (!house) {
      return res.status(404).json({ message: 'House not found' });
    }

    // Check if user owns this house
    if (house.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied. You can only update your own listings.' });
    }

    const updatedHouse = await House.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('owner', 'name email phone isVerified');

    res.json({
      message: 'House listing updated successfully',
      house: updatedHouse
    });
  } catch (error) {
    console.error('Update house error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid house ID' });
    }
    res.status(500).json({ message: 'Server error while updating house listing' });
  }
});

// @route   DELETE /api/houses/:id
// @desc    Delete house listing
// @access  Private (Owner only - own listings)
router.delete('/:id', [auth, ownerOnly], async (req, res) => {
  try {
    const house = await House.findById(req.params.id);

    if (!house) {
      return res.status(404).json({ message: 'House not found' });
    }

    // Check if user owns this house
    if (house.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied. You can only delete your own listings.' });
    }

    await House.findByIdAndDelete(req.params.id);

    res.json({ message: 'House listing deleted successfully' });
  } catch (error) {
    console.error('Delete house error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid house ID' });
    }
    res.status(500).json({ message: 'Server error while deleting house listing' });
  }
});

// @route   GET /api/houses/owner/my-listings
// @desc    Get current owner's listings
// @access  Private (Owner only)
router.get('/owner/my-listings', [auth, ownerOnly], async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const houses = await House.find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('owner', 'name email phone isVerified');

    const total = await House.countDocuments({ owner: req.user._id });

    res.json({
      houses,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        hasNext: skip + houses.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get owner listings error:', error);
    res.status(500).json({ message: 'Server error while fetching your listings' });
  }
});

// @route   GET /api/houses/owner/analytics
// @desc    Get analytics summary and per-house stats for current owner
// @access  Private (Owner only)
router.get('/owner/analytics', [auth, ownerOnly], async (req, res) => {
  try {
    const houses = await House.find({ owner: req.user._id }).sort({ createdAt: -1 });

    const summary = houses.reduce(
      (acc, house) => {
        acc.totalViews += house.views || 0;
        acc.totalFavorites += house.favoriteCount || 0;

        const stats = house.contactStats || {};
        acc.totalContacts += stats.total || 0;
        acc.whatsapp += stats.whatsapp || 0;
        acc.phone += stats.phone || 0;
        acc.email += stats.email || 0;

        return acc;
      },
      {
        totalViews: 0,
        totalFavorites: 0,
        totalContacts: 0,
        whatsapp: 0,
        phone: 0,
        email: 0,
      }
    );

    res.json({ summary, houses });
  } catch (error) {
    console.error('Get owner analytics error:', error);
    res.status(500).json({ message: 'Server error while fetching analytics' });
  }
});

module.exports = router;
