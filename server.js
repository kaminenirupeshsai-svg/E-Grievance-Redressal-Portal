// ===============================
// server.js
// ===============================

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
require("dotenv").config(); // Load environment variables

const app = express();

// ===============================
// 1. STATIC FILES
// ===============================
app.use(express.static(path.join(__dirname, "public")));

// ===============================
// 2. EJS VIEWS
// ===============================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ===============================
// 3. DATABASE (MongoDB Atlas)
// ===============================
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===============================
// 4. MIDDLEWARE
// ===============================
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

// ===============================
// 5. HEALTH CHECK (test Railway deployment)
// ===============================
app.get("/health", (req, res) => res.send("✅ Server is running"));

// ===============================
// 6. STATIC HTML ROUTES
// ===============================
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/student-register", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "register.html"))
);
app.get("/contact", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "contact.html"))
);
app.get("/about", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "about.html"))
);

// ===============================
// 7. ROUTES IMPORT
// ===============================
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

// ===============================
// 8. ROUTES MOUNTING
// ===============================
app.use("/", pagesRoutes);
app.use("/auth", authRoutes);
app.use("/complaint", complaintRoutes);
app.use("/admin", adminRoutes);
app.use("/grievance", grievanceRoutes);
app.use("/officer", officerRoutes);

// ===============================
// 9. START SERVER (Dynamic port for Railway)
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

