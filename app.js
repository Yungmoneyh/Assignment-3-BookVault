// ========================
//        SETUP
// ========================
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();

// ========================
//   DATABASE CONNECTION
// ========================
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bookvault";

mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ========================
//     VIEW ENGINE + STATIC
// ========================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // << IMPORTANT

app.use(methodOverride("_method"));

// ========================
//        SESSION
// ========================
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret123",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: mongoUri,
    }),
  })
);

// Makes `user` available in ALL EJS PAGES
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// ========================
//        ROUTES
// ========================
const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");

app.use("/", authRoutes);
app.use("/books", bookRoutes);

// ========================
//       HOME PAGE
// ========================
app.get("/", (req, res) => {
  res.render("index");
});

// ========================
//        404 PAGE
// ========================
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

// ========================
//      START SERVER
// ========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
