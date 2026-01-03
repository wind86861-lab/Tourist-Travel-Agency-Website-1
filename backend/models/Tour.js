const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Tour title is required'],
        trim: true
    },
    fromCity: {
        type: String,
        required: [true, 'Origin city is required'],
        default: 'Tashkent'
    },
    toCity: {
        type: String,
        required: [true, 'Destination city is required']
    },
    duration: {
        type: String,
        required: [true, 'Duration is required'],
        default: '7 days'
    },
    startDate: {
        type: Date
    },
    isVisaRequired: {
        type: Boolean,
        default: false
    },
    visaInfo: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    flightVendors: [{
        type: String
    }],
    included: [{
        type: String
    }],
    notIncluded: [{
        type: String
    }],
    itinerary: [{
        day: Number,
        title: String,
        description: String
    }],
    packageType: {
        type: String,
        enum: ['Full', 'Partial'],
        default: 'Full'
    },
    tourType: {
        type: String,
        enum: ['B2C', 'B2B'],
        default: 'B2C'
    },
    priceAdult: {
        type: Number,
        required: [true, 'Adult price is required'],
        min: 0
    },
    priceChild: {
        type: Number,
        required: [true, 'Child price is required'],
        min: 0
    },
    agencyCommission: {
        type: Number,
        default: 0,
        min: 0
    },
    capacity: {
        type: Number,
        required: true,
        default: 20
    },
    bookedCount: {
        type: Number,
        default: 0
    },
    images: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['Active', 'Paused', 'Draft'],
        default: 'Active'
    },
    isPopular: {
        type: Boolean,
        default: false
    },
    isGreatPackage: {
        type: Boolean,
        default: false
    },
    discountType: {
        type: String,
        enum: ['none', 'percentage', 'fixed'],
        default: 'none'
    },
    discountValue: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Virtual for available spots
tourSchema.virtual('availableSpots').get(function () {
    return this.capacity - this.bookedCount;
});

// Ensure virtuals are included in JSON
tourSchema.set('toJSON', { virtuals: true });
tourSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Tour', tourSchema);
