const BulkPurchase = require("../models/bulkPurchase");
const Product = require("../models/product");
const Inventory = require("../models/inventory");
const mongoose = require("mongoose");

const createBulkPurchase = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const {
      productId,
      supplierId,
      quantity,
      unit,
      weight,
      weightUnit,
      totalCost,
      purchaseDate,
    } = req.body;

    // 1. Validate request

    if (
      !productId ||
      quantity === undefined ||
      !unit ||
      weight === undefined ||
      !totalCost
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Product, quantity, unit, weight and total cost are required",
      });
    }

    if (
      Number(quantity) <= 0 ||
      Number(weight) <= 0 ||
      Number(totalCost) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Quantity, weight and total cost must be greater than zero",
      });
    }

    // Start transaction
    session.startTransaction();

    // Verify product ownership
    const product = await Product.findOne({
      _id: productId,
      userId: req.userId,
    }).session(session);

    if (!product) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Create purchase
    const purchase = await BulkPurchase.create(
      [
        {
          userId: req.userId,
          productId,
          supplierId: supplierId || null,
          quantity,
          unit,
          weight,
          weightUnit: weightUnit || "kg",
          remainingWeight: weight,
          totalCost,
          purchaseDate: purchaseDate || new Date(),
        },
      ],
      { session }
    );

    // Update inventory

    const inventory = await Inventory.findOneAndUpdate(
      {
        userId: req.userId,
        productId,
      },
      {
        $inc: {
          bulkRemaining: Number(weight),
        },
        $set: {
          bulkUnit: weightUnit || "kg",
          lastUpdated: new Date(),
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        session,
      }
    );

    // Commit transaction
    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "Bulk purchase recorded successfully",
      purchase: purchase[0],
      inventory,
    });
  } catch (error) {
    // Rollback if anything fails
    await session.abortTransaction();

    console.error("Create bulk purchase error:", error);

    return res.status(500).json({
      success: false,
      message: "Purchase could not be completed",
    });
  } finally {
    //Always close session
    await session.endSession();
  }
};

const getBulkPurchases = async (req, res) => {
  try {
    const purchases = await BulkPurchase.find({
      userId: req.userId,
    })
      .populate("productId", "name category")
      .populate("supplierId", "name phone")
      .sort({ purchaseDate: -1 });

    return res.status(200).json({
      success: true,
      count: purchases.length,
      purchases,
    });
  } catch (error) {
    console.error("Get bulk purchases error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching purchases",
    });
  }
};

const getBulkPurchaseById = async (req, res) => {
  try {
    const purchase = await BulkPurchase.findOne({
      _id: req.params.id,
      userId: req.userId,
    })
      .populate("productId", "name category")
      .populate("supplierId", "name phone");

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    return res.status(200).json({
      success: true,
      purchase,
    });
  } catch (error) {
    console.error("Get purchase error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the purchase",
    });
  }
};

module.exports = {
  createBulkPurchase,
  getBulkPurchases,
  getBulkPurchaseById,
};