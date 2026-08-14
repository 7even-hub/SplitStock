const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
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

    bulkRemaining: {
      type: Number,
      default: 0,
      min: 0,
    },

    bulkUnit: {
      type: String,
      default: "kg",
    },

    repackRemaining: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// making sure each user only has one inventory record per product
inventorySchema.index(
  { userId: 1, productId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);