const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createBulkPurchase,
  getBulkPurchases,
  getBulkPurchaseById,
} = require("../controllers/bulkPurchaseController");

const router = express.Router();

router.post("/", protect, createBulkPurchase);

router.get("/", protect, getBulkPurchases);

router.get("/:id", protect, getBulkPurchaseById);

module.exports = router;