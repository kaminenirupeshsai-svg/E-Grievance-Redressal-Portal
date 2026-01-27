const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const path = require("path");
require("dotenv").config();

const app = express();

/* ===============================
   1. BODY PARSERS
================================ */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* ===============================
   2. VIEW ENGINE
================================ */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* ===============================
   3. DATABASE
================================ */
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

/* ===============================
   4. SESSION
================================ */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "super-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
    }),
  })
);

/* ===============================
   5. ROUTES
================================ */
app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));
app.use("/complaint", require("./routes/complaint"));
app.use("/admin", require("./routes/admin"));
app.use("/grievance", require("./routes/grievance"));
app.use("/officer", require("./routes/officer"));

/* ===============================
   6. STATIC FILES
================================ */
app.use(express.static(path.join(__dirname, "public")));

/* ===============================
   7. HEALTH CHECK
================================ */
app.get("/health", (req, res) => res.send("✅ Server running"));

/* ===============================
   8. GLOBAL ERROR HANDLER
   Must be after all routes
================================ */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("❌ Server Error: " + err.message);
});

/* ===============================
   9. START SERVER
================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});












