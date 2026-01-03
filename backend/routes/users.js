const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/users/pending
// @desc    Get all pending (unapproved) registrations
// @access  Private/Admin
router.get('/pending', protect, admin, async (req, res) => {
    try {
        const users = await User.find({ isApproved: false }).sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PATCH /api/users/:id/approve
// @desc    Approve a user/agent registration
// @access  Private/Admin
router.patch('/:id/approve', protect, admin, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User approved successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/users/:id
// @desc    Delete/reject a user
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
