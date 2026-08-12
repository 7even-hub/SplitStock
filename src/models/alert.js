// models/Alert.js

const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
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

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["low_stock", "out_of_stock", "other"],
      default: "low_stock",
    },

    triggeredAt: {
      type: Date,
      default: Date.now,
    },

    resolved: {
      type: Boolean,
      default: false,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

alertSchema.index({
  userId: 1,
  resolved: 1,
  triggeredAt: -1,
});

module.exports = mongoose.model("Alert", alertSchema);