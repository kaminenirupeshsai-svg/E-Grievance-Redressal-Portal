require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connected");

    const exists = await User.findOne({ email: "admin@example.com", role: "admin" });
    if (exists) {
      console.log("⚠️ Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin123", 10);

    await User.create({
      name: "Super Admin",
      roll: "0001",
      email: "admin@example.com",
      department: "Administration",
      password: hashedPassword,
      role: "admin"
    });

    console.log("✅ Admin created successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

createAdmin();
