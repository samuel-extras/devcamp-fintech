const express = require("express");
const views = require("./../controllers/viewsController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.get("/", views.useNoLayout, views.home);
router.get(
  "/profile",
  views.useProfileLayout,
  authController.protect,
  views.profile
);
router.get(
  "/change-password",
  views.useProfileLayout,
  authController.protect,
  views.changePassword
);
router.get(
  "/history",
  views.useProfileLayout,
  authController.protect,
  views.history
);

router.get(
  "/buy-airtime/summary",
  authController.protect,
  views.useSummaryLayout,
  views.airtimeSummary
);
router.get(
  "/buy-data/summary",
  authController.protect,
  views.useSummaryLayout,
  views.dataSummary
);
router.get(
  "/fund-transfer/summary",
  authController.protect,
  views.useSummaryLayout,
  views.transferSummary
);
router.get(
  "/cable-tv/summary",
  authController.protect,
  views.useSummaryLayout,
  views.cableSummary
);
router.get(
  "/electric-bill/summary",
  authController.protect,
  views.useSummaryLayout,
  views.electricSummary
);

router.get("/fund-wallet", authController.protect, views.fundWallet);
router.get("/transfer-fund", authController.protect, views.transferFund);

router.use(authController.isLoggedIn);

router.get("/buy-airtime", views.airtime);
router.get("/buy-data", views.dataBundle);
router.get("/cable-tv", views.cableTv);
router.get("/electric-bill", views.electricBill);

router.use(views.usePagesLayout);

router.get("/auth", views.auth);
router.get("/about", views.about);
router.get("/contact", views.contact);
router.get("/faq", views.faq);
router.get("/support", views.support);

module.exports = router;
