const mongoose = require("mongoose");

const repackBatchSchema = new mongoose.Schema(
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

    bulkPurchaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BulkPurchase",
      required: true,
      index: true,
    },

    packageSize: {
      type: Number,
      required: true,
      min: 0.0001,
    },

    packageUnit: {
      type: String,
      required: true,
      trim: true,
    },

    expectedUnits: {
      type: Number,
      required: true,
      min: 0,
    },

    actualUnits: {
      type: Number,
      required: true,
      min: 0,
    },

    wastage: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    costPerUnit: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      min: 0,
    },

    sellingPrice: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      min: 0,
    },

    targetMargin: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    remainingUnits: {
      type: Number,
      required: true,
      min: 0,
    },

    sourceWeight: {
      type: Number,
      required: true,
      min: 0,
    },

    processedWeight: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["active", "depleted"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

repackBatchSchema.index({
  userId: 1,
  productId: 1,
  status: 1,
});

module.exports = mongoose.model("RepackBatch", repackBatchSchema);