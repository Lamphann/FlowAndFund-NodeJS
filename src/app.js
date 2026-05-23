require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const jwt = require("jsonwebtoken");

const { getCategory } = require("./helpers/categoryHelper");
const formatMoney = require("./helpers/formatMoney");

const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// JWT GLOBAL
app.use((req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      req.user = null;
    }
  } else {
    req.user = null;
  }

  res.locals.user = req.user;
  res.locals.getCategory = getCategory;
  res.locals.formatMoney = formatMoney;
  next();
});

// VIEW
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts);
app.set("layout", "layouts/main");
app.use((req, res, next) => {
  res.locals.title = "Quản lý chi tiêu";
  next();
});

// ROUTES
app.use("/", authRoutes);
app.use("/expenses", expenseRoutes);

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

module.exports = app;
