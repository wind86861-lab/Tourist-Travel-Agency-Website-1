const mongoose = require('mongoose');

const travelerSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: Date },
    gender: { type: String, enum: ['Male', 'Female'], default: 'Male' },
    nationality: { type: String, default: '' },
    passport: { type: String, default: '' }
}, { _id: false });

const bookingSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    bookingRef: {
        type: String,
        unique: true
    },
    travelDate: {
        type: Date,
        required: [true, 'Travel date is required']
    },
    adults: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    children: {
        type: Number,
        default: 0,
        min: 0
    },
    rooms: {
        type: Number,
        default: 1,
        min: 1
    },
    travelers: [travelerSchema],
    addons: {
        transfer: { type: Boolean, default: false },
        hotelUpgrade: { type: Boolean, default: false },
        guide: { type: Boolean, default: false },
        meals: { type: Boolean, default: false },
        insurance: { type: Boolean, default: false }
    },
    contact: {
        phone: { type: String, required: true },
        email: { type: String, required: true },
        city: { type: String, default: '' },
        notes: { type: String, default: '' }
    },
    totalPrice: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['Card', 'Bank', 'Online', 'Cash'],
        default: 'Card'
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

// Auto-generate booking reference before saving
bookingSchema.pre('save', async function (next) {
    if (!this.bookingRef) {
        this.bookingRef = 'AT-' + Math.floor(100000 + Math.random() * 900000);
    }
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);
