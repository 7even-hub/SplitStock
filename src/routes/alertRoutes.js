const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  getAlerts,
  getAlertById,
  resolveAlert,
  getAlertCount,
} = require("../controllers/alertController");

const router = express.Router();

router.get("/", protect, getAlerts);

router.get("/count", protect, getAlertCount);

router.get("/:id", protect, getAlertById);

router.patch("/:id/resolve", protect, resolveAlert);

module.exports = router;