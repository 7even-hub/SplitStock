const Product = require("../models/product");

// CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
    const { name, category, lowStockLimit } = req.body;

    if (!name || !category || lowStockLimit === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, category and low stock limit are required",
      });
    }

    if (lowStockLimit < 0) {
      return res.status(400).json({
        success: false,
        message: "Low stock limit cannot be negative",
      });
    }

    // Check if this user already has a product with this name
    const existingProduct = await Product.findOne({
      userId: req.userId,
      name: name.trim(),
    });

    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "You already have a product with this name",
      });
    }

    const product = await Product.create({
      userId: req.userId,
      name: name.trim(),
      category: category.trim(),
      lowStockLimit,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the product",
    });
  }
};

// GET ALL PRODUCTS
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({
      userId: req.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching products",
    });
  }
};

// GET ONE PRODUCT
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the product",
    });
  }
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const { name, category, lowStockLimit } = req.body;

    const product = await Product.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (name !== undefined) {
      product.name = name.trim();
    }

    if (category !== undefined) {
      product.category = category.trim();
    }

    if (lowStockLimit !== undefined) {
      if (lowStockLimit < 0) {
        return res.status(400).json({
          success: false,
          message: "Low stock limit cannot be negative",
        });
      }

      product.lowStockLimit = lowStockLimit;
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the product",
    });
  }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the product",
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};