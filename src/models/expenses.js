// models/Expense.js

const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
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
      default: null,
    },

    amount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      min: 0,
    },

    type: {
      type: String,
      enum: [
        "transport",
        "packaging",
        "electricity",
        "rent",
        "labour",
        "spoilage",
        "maintenance",
        "other",
      ],
      required: true,
    },

    description: {
      type: String,
      trim: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

expenseSchema.index({
  userId: 1,
  date: -1,
});

module.exports = mongoose.model("Expense", expenseSchema);