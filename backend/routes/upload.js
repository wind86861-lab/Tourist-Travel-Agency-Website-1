const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, admin } = require('../middleware/auth');

// Storage configuration
const storage = multer.diskStorage({
    destination(req, file, cb) {
        const folder = file.fieldname === 'document' ? 'uploads/documents/' : 'uploads/tours/';
        cb(null, folder);
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// File filter
function checkFileTypes(file, cb) {
    const filetypes = /jpg|jpeg|png|webp|avif|pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype) || file.mimetype === 'application/pdf' || file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images, PDF, or Word documents only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileTypes(file, cb);
    }
});

// @desc    Upload tour images
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a file' });
    }
    res.json({
        message: 'Image uploaded',
        url: `/uploads/tours/${req.file.filename}`
    });
});

// @desc    Upload multiple tour images
// @route   POST /api/upload/multiple
// @access  Private/Admin
router.post('/multiple', protect, admin, upload.array('images', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'Please upload files' });
    }

    const urls = req.files.map(file => `/uploads/tours/${file.filename}`);
    res.json({
        message: 'Images uploaded',
        urls
    });
});

// @desc    Upload registration document (Public)
// @route   POST /api/upload/document
// @access  Public
router.post('/document', upload.single('document'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a document' });
    }
    res.json({
        message: 'Document uploaded',
        url: `/uploads/documents/${req.file.filename}`
    });
});

module.exports = router;
