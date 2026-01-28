const express = require("express");
const router = express.Router();
const path = require("path");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

/* ------------------------------
   LOGIN PAGES
------------------------------ */
router.get("/student-login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/student-login.html"));
});

router.get("/student-register", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/student-register.html"));
});

router.get("/admin-login", (req, res) => {
  res.render("admin-login");
});

router.get("/grievance-login", (req, res) => {
  res.render("grievance-login");
});

/* ------------------------------
   STUDENT LOGIN
------------------------------ */
router.post("/login-student", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: "student" });
    if (!user) return res.send("❌ Student not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.send("❌ Invalid password");

    req.session.user = {
      id: user._id.toString(),
      name: user.name,
      role: user.role
    };

    res.redirect("/student-dashboard.html");
  } catch (err) {
    console.error("STUDENT LOGIN ERROR:", err);
    res.status(500).send("Login failed");
  }
});

/* ------------------------------
   ADMIN LOGIN (FIXED)
------------------------------ */
router.get("/create-admin", async (req, res) => {
  const bcrypt = require("bcryptjs");
  const User = require("../models/User");

  const hashed = await bcrypt.hash("admin123", 10);

  await User.create({
    name: "Admin",
    email: "admin@gmail.com",
    password: hashed,
    role: "admin"
  });

  res.send("✅ Admin created");
});

/* ------------------------------
   GRIEVANCE OFFICER LOGIN
------------------------------ */
router.post("/login-grievance", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: "grievance" });
    if (!user) return res.send("❌ Grievance officer not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.send("❌ Invalid password");

    req.session.user = {
      id: user._id.toString(),
      name: user.name,
      role: user.role
    };

    res.redirect("/grievance/dashboard");
  } catch (err) {
    console.error("GRIEVANCE LOGIN ERROR:", err);
    res.status(500).send("Grievance login failed");
  }
});

/* ------------------------------
   STUDENT REGISTRATION
------------------------------ */
router.post("/register", async (req, res) => {
  try {
    const { name, roll, email, department, password, confirm_password } = req.body;

    if (password !== confirm_password) {
      return res.send("❌ Passwords do not match");
    }

    const exists = await User.findOne({ email });
    if (exists) return res.send("❌ User already exists");

    const hashedPass = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      roll,
      email,
      department,
      password: hashedPass,
      role: "student" // always student here
    });

    await user.save();

    res.redirect("/auth/student-login");
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).send("Registration failed");
  }
});

module.exports = router;





