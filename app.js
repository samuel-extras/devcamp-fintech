const path = require("path");
const express = require("express");
const AppError = require("./utils/appError");
const handlebarHelpers = require("./utils/handlebars");
const globalError = require("./controllers/errorController");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express_handlebar = require("express-handlebars");

const viewRoutes = require("./routes/viewRoutes");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const siteRoutes = require("./routes/siteRoutes");
/**
 * Initialize Express
 */
const app = express();

/**
 * Set up view engine
 */
const hbs = express_handlebar.create({
  extname: "hbs",
  defaultLayout: "main",
  helpers: handlebarHelpers,
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

/**
 * Serve static files from the public folder
 */
app.use(express.static(path.join(__dirname, "public")));

/**
 * Initializing MiddleWares
 */
app.use(express.json({ extended: false }));
app.use(cookieParser());
app.use(cors());

/**
 * Initializing Page Routes
 */
app.use("/", viewRoutes);

/**
 * Initializing API Routes
 */
app.use("/api/user", userRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/site", siteRoutes);

/**
 *  404 Error Handler (if no route matches)
 */
app.all("*", (req, res, next) => {
  const err = new AppError(`Cant find ${req.originalUrl} on this server`, 404);
  next(err);
});

/**
 * Global error handler
 * handles all error in the app
 */
app.use(globalError);

module.exports = app;
