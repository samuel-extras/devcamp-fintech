const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

/**
 * Account Creation and Authentication
 */
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

/**
 * Reset a forgotten password
 */
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

/**
 * Protected Routes
 * Only authenticated user can access these routes
 */
router.use(authController.protect);

router.get("/getMe", userController.getMe, userController.getUser);
router.patch("/updateMyPassword", authController.updatePassword);
router.patch("/updateMe", userController.updateMe);
router.delete("/deleteMe", userController.deleteMe);
router.post("/fundWallet", userController.fundWallet);

/**
 * Restricted Routes
 * Only users with admin authorization can access these routes
 */
router.use(authController.restrictTo("role", "admin"));

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

/**
 * Customize the status of a user [active | suspended | deactivated]
 */
router.patch("/activate/:id", userController.activateUser);
router.patch(
  "/deactivate/:id",
  userController.updateStatus("deactivated"),
  userController.updateUser
);
router.patch(
  "/suspend/:id",
  userController.updateStatus("suspended"),
  userController.updateUser
);

module.exports = router;
