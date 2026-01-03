const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const { protect, admin } = require('../middleware/auth');

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Public (guest booking allowed)
router.post('/', async (req, res) => {
    try {
        const { tour, travelDate, adults, children, rooms, travelers, addons, contact, totalPrice, paymentMethod } = req.body;

        // Validate tour exists and has capacity
        const tourDoc = await Tour.findById(tour);
        if (!tourDoc) {
            return res.status(404).json({ message: 'Tour not found' });
        }

        const totalPeople = adults + children;
        if (tourDoc.availableSpots < totalPeople) {
            return res.status(400).json({ message: 'Not enough spots available' });
        }

        // Create booking
        const booking = await Booking.create({
            tour,
            user: req.user?._id,
            travelDate,
            adults,
            children,
            rooms,
            travelers,
            addons,
            contact,
            totalPrice,
            paymentMethod
        });

        // Update tour booked count
        await Tour.findByIdAndUpdate(tour, {
            $inc: { bookedCount: totalPeople }
        });

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/bookings
// @desc    Get all bookings (Admin only)
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('tour', 'title fromCity toCity')
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/bookings/my
// @desc    Get current user's bookings
// @access  Private
router.get('/my', protect, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('tour', 'title fromCity toCity priceAdult')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('tour')
            .populate('user', 'name email');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check ownership or admin
        if (booking.user?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PATCH /api/bookings/:id/status
// @desc    Update booking status
// @access  Private/Admin
router.patch('/:id/status', protect, admin, async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
