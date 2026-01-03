const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'agent', 'admin'],
        default: 'user'
    },
    phone: {
        type: String,
        default: ''
    },
    // B2B Specific Fields
    officialName: String,
    latinName: String,
    headName: String,
    city: String,
    phone1: String,
    emailForMailings: String,
    comment: String,
    address: String,
    location: {
        lat: Number,
        lng: Number
    },
    tin: String, // ИНН/БИН
    registryNumber: String,
    activityType: String,
    vatRate: String,

    registrationCertificate: {
        authority: String,
        series: String,
        number: String
    },

    bankingDetails: {
        zipCode: String,
        accountingPhone: String,
        registrationDate: Date,
        accountNumber: String,
        ownershipForm: String
    },

    postalAddress: String,
    actualAddress: String,
    subscribeToNewsletter: {
        type: Boolean,
        default: false
    },

    documents: [String], // URLs to uploaded files

    loginInfo: {
        fullName: String,
        phone: String,
        email: String,
        login: {
            type: String,
            unique: true,
            sparse: true
        },
        city: String
    },

    isApproved: {
        type: Boolean,
        default: function () {
            return this.role === 'user'; // Users auto-approved, agents need approval
        }
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match password method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
