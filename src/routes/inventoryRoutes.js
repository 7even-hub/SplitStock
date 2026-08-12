const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  getInventory,
  getProductInventory,
} = require("../controllers/inventoryController");

const router = express.Router();

router.get("/", protect, getInventory);

router.get("/:productId", protect, getProductInventory);

module.exports = router;