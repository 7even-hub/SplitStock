const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createRepackBatch,
  getRepackBatches,
  getRepackBatchById,
} = require("../controllers/repackBatchController");

const router = express.Router();

router.post("/", protect, createRepackBatch);

router.get("/", protect, getRepackBatches);

router.get("/:id", protect, getRepackBatchById);

module.exports = router;