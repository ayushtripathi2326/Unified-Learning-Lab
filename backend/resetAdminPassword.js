require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const User = mongoose.model('User', new mongoose.Schema({
            email: String,
            password: String,
            role: String
        }));

        const email = 'admin@learninglab.com';
        const newPassword = 'Admin@123'; // Change this to your desired password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const result = await User.updateOne(
            { email },
            { $set: { password: hashedPassword } }
        );

        if (result.modifiedCount > 0) {
            console.log(`✅ Password updated for ${email}`);
            console.log(`New password: ${newPassword}`);
        } else {
            console.log(`❌ User not found: ${email}`);
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

resetPassword();
