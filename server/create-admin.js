require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/impactscore";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    fullName: { type: String },
    role: { type: String, enum: ['subscriber', 'admin'], default: 'subscriber' },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

mongoose.connect(uri)
  .then(async () => {
    let admin = await User.findOne({ role: 'admin' });
    if (admin) {
        console.log("Existing admin found:");
        console.log("Email:", admin.email);
        // We cannot log the password as it's hashed. Let's update it to 'admin123' so the user knows it.
        const salt = await bcrypt.genSalt(10);
        admin.passwordHash = await bcrypt.hash('admin123', salt);
        await admin.save();
        console.log("Password has been reset to: admin123");
    } else {
        console.log("No admin found. Creating one...");
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('admin123', salt);
        admin = new User({
            email: 'admin@impactscore.com',
            passwordHash,
            fullName: 'Admin User',
            role: 'admin'
        });
        await admin.save();
        console.log("Created admin:");
        console.log("Email: admin@impactscore.com");
        console.log("Password: admin123");
    }
    process.exit(0);
  })
  .catch(err => {
    console.error("ERROR", err.message);
    process.exit(1);
  });
