const express = require("express");
const authController = require("./../controllers/authController");
const siteController = require("./../controllers/siteController");

const router = express.Router();

/**
 * Account Creation and Authentication
 */
router.post("/support", siteController.supportRequest);

/**
 * Protected Routes
 * Only authenticated user can access these routes
 */
router.use(authController.protect);

/**
 * Restricted Routes
 * Only users with admin authorization can access these routes
 */
router.use(authController.restrictTo("role", "admin"));

router.get("/support", siteController.getSupports);
router.patch(
  "/resolveSupport/:id",
  (req, res, next) => {
    req.body["resolved"] = true;
    next();
  },
  siteController.resolveSupport
);

module.exports = router;
