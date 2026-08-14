const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
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

    repackBatchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RepackBatch",
      required: true,
      index: true,
    },

    quantitySold: {
      type: Number,
      required: true,
      min: 1,
    },

    sellingPrice: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      min: 0,
    },

    costPerUnit: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      min: 0,
    },

    totalAmount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      min: 0,
    },

    profit: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },

    saleDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

saleSchema.index({
  userId: 1,
  saleDate: -1,
});

module.exports = mongoose.model("Sale", saleSchema);