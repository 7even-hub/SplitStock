const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

router.post("/", protect, createProduct);

router.get("/", protect, getProducts);

router.get("/:id", protect, getProductById);

router.patch("/:id", protect, updateProduct);

router.delete("/:id", protect, deleteProduct);

module.exports = router;