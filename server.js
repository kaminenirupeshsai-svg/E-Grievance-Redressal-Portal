const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
require("dotenv").config(); // Load .env variables

const app = express();

/* ============================================
   🔹 1. STATIC FILES
============================================ */
app.use(express.static(path.join(__dirname, "public"))); // SERVES HTML FILES

/* ============================================
   🔹 2. EJS VIEWS
============================================ */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* ============================================
   🔹 3. DATABASE (MongoDB Atlas)
============================================ */
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

/* ============================================
   🔹 4. MIDDLEWARE
============================================ */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "super-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: "sessions",
    }),
  })
);

/* ============================================
   🔹 5. FIX STATIC HTML ROUTES
============================================ */

// Student Register Page (HTML)
app.get("/student-register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

// About Page
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "about.html"));
});

// Contact Page
app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "contact.html"));
});

// Home Page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ============================================
   🔹 6. ROUTES IMPORT
============================================ */
const pagesRoutes = require("./routes/pages");
const authRoutes = require("./routes/auth");
const complaintRoutes = require("./routes/complaint");
const adminRoutes = require("./routes/admin");
const grievanceRoutes = require("./routes/grievance");
const officerRoutes = require("./routes/officer");

// Optional dashboard route
try {
  const dashboardRoutes = require("./routes/dashboard");
  app.use("/dashboard", dashboardRoutes);
} catch (e) {
  console.log("⚠️ dashboard.js not found. Skipping dashboard route.");
}

/* ============================================
   🔹 7. ROUTES MOUNTING
============================================ */
app.use("/", pagesRoutes);
app.use("/auth", authRoutes);
app.use("/complaint", complaintRoutes);
app.use("/admin", adminRoutes);
app.use("/grievance", grievanceRoutes);
app.use("/officer", officerRoutes);

/* ============================================
   🔹 8. START SERVER
============================================ */
const PORT = process.env.PORT || 5000;  // fallback for local
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



