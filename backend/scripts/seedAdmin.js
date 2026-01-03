const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/avocado-tour');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'user' },
    isApproved: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function createAdmin() {
    try {
        // Check if admin exists
        const existingAdmin = await User.findOne({ email: 'admin@avocado.tour' });
        if (existingAdmin) {
            console.log('✅ Admin user already exists');
            console.log('   Email: admin@avocado.tour');
            console.log('   Password: Admin@2024');
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Admin@2024', salt);

        // Create admin
        const admin = await User.create({
            name: 'Super Admin',
            email: 'admin@avocado.tour',
            password: hashedPassword,
            role: 'admin',
            isApproved: true
        });

        console.log('🎉 Admin user created successfully!');
        console.log('   Email: admin@avocado.tour');
        console.log('   Password: Admin@2024');
        console.log('   Role:', admin.role);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
        process.exit(1);
    }
}

createAdmin();
