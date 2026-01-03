const express = require('express');
const router = express.Router();
const Tour = require('../models/Tour');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/tours
// @desc    Get all active tours (public)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { tourType, status } = req.query;
        const filter = {};

        if (tourType) filter.tourType = tourType;
        if (status) filter.status = status;
        else filter.status = 'Active';

        const tours = await Tour.find(filter).sort({ createdAt: -1 });
        res.json(tours);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/tours/:id
// @desc    Get single tour by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        if (!tour) {
            return res.status(404).json({ message: 'Tour not found' });
        }
        res.json(tour);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/tours
// @desc    Create a new tour
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const tour = await Tour.create(req.body);
        res.status(201).json(tour);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/tours/:id
// @desc    Update a tour
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!tour) {
            return res.status(404).json({ message: 'Tour not found' });
        }
        res.json(tour);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/tours/:id
// @desc    Delete a tour
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id);
        if (!tour) {
            return res.status(404).json({ message: 'Tour not found' });
        }
        res.json({ message: 'Tour deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
