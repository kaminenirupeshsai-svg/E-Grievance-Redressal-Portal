const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");

const app = express();

/* ============================================
   🔹 1. STATIC FILES
============================================ */
app.use(express.static(path.join(__dirname, "public")));   // SERVES HTML FILES

/* ============================================
   🔹 2. EJS VIEWS
============================================ */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* ============================================
   🔹 3. DATABASE
============================================ */
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err));

/* ============================================
   🔹 4. MIDDLEWARE
============================================ */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "super-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/egrievance",
    }),
  })
);

/* ============================================
   🔹 5. FIX STATIC HTML ROUTES
============================================ */

// 🔥 Student Register Page (HTML)
app.get("/student-register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

// 🔥 About Page (if you have it)
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "about.html"));
});

/* ============================================
   🔹 6. ROUTES IMPORT
============================================ */
const pagesRoutes = require("./routes/pages");
const authRoutes = require("./routes/auth");
const complaintRoutes = require("./routes/complaint");
const adminRoutes = require("./routes/admin");
const grievanceRoutes = require("./routes/grievance");
const officerRoutes = require('./routes/officer');

/* ============================================
   🔹 7. ROUTES MOUNTING
============================================ */
app.use("/", pagesRoutes);
app.use("/auth", authRoutes);
app.use("/complaint", complaintRoutes);
app.use("/admin", adminRoutes);
app.use("/grievance", grievanceRoutes);
app.use("/officer", officerRoutes);

// Optional dashboard route
try {
  const dashboardRoutes = require("./routes/dashboard");
  app.use("/dashboard", dashboardRoutes);
} catch (e) {
  console.log("⚠️ dashboard.js not found. Skipping dashboard route.");
}

/* ============================================
   🔹 8. HOME 
============================================ */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* contact*/
app.get("/contact", (req, res) => {
    res.sendFile(__dirname + "/public/contact.html");
});

/* ============================================
   🔹 9. START SERVER
============================================ */
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);



