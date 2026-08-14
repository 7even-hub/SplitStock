const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createSale,
  getSales,
  getSaleById,
} = require("../controllers/saleController");

const router = express.Router();

router.post("/", protect, createSale);

router.get("/", protect, getSales);

router.get("/:id", protect, getSaleById);

module.exports = router;