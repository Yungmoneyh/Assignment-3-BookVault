const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();

// ===== DB CONNECTION =====
// Connect to MongoDB using URI from .env
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo Error:", err));

// ===== VIEW ENGINE =====
// Set EJS as the view engine and set views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ===== MIDDLEWARE =====
app.use(express.urlencoded({ extended: true })); // parse form data
app.use(express.json()); // parse JSON data
app.use(methodOverride("_method")); // support PUT & DELETE via forms
app.use(express.static(path.join(__dirname, "public"))); // serve static files

// ===== SESSION =====
app.use(
  session({
    secret: process.env.SESSION_SECRET, // secret for signing session ID
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }), // store sessions in MongoDB
  })
);

// middleware to expose user ID to EJS templates
app.use((req, res, next) => {
  res.locals.user = req.session.userId || null;
  next();
});

// ===== ROUTES =====
app.use("/", require("./routes/auth")); // auth routes (login/register/logout)
app.use("/books", require("./routes/books")); // book CRUD routes

// HOME PAGE
app.get("/", (req, res) => {
  res.render("index"); // render homepage
});

// START SERVER
app.listen(3000, () =>
  console.log("🚀 Server running at http://localhost:3000")
);
