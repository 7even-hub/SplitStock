const mongoose = require("mongoose");

const bulkPurchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      default: null,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0.0001,
    },

    unit: {
      type: String,
      required: true,
      trim: true,
    },

    weight: {
      type: Number,
      required: true,
      min: 0.0001,
    },

    weightUnit: {
      type: String,
      enum: ["g", "kg", "ml", "l"],
      required: true,
      default: "kg",
    },

    remainingWeight: {
      type: Number,
      required: true,
      min: 0,
    },

    totalCost: {
      type: Number,
      required: true,
      min: 0,
    },

    purchaseDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

bulkPurchaseSchema.index({
  userId: 1,
  productId: 1,
  purchaseDate: -1,
});

module.exports = mongoose.model("BulkPurchase", bulkPurchaseSchema);