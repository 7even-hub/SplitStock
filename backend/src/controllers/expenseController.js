const Expense = require("../models/expense");
const Product = require("../models/product");


const createExpense = async (req, res) => {
  try {
    const {
      productId,
      amount,
      type,
      description,
      date,
    } = req.body;

    if (
      amount === undefined ||
      !type
    ) {
      return res.status(400).json({
        success: false,
        message: "Amount and expense type are required",
      });
    }

    const amountNum = Number(amount);

    if (
      !Number.isFinite(amountNum) ||
      amountNum <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Expense amount must be greater than zero",
      });
    }

    //verify product ownership if productId is provided

    if (productId) {
      const product = await Product.findOne({
        _id: productId,
        userId: req.userId,
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
    }

    const expense = await Expense.create({
      userId: req.userId,
      productId: productId || null,
      amount: amountNum,
      type,
      description: description?.trim(),
      date: date || new Date(),
    });
    
    return res.status(201).json({
      success: true,
      message: "Expense recorded successfully",
      expense,
    });
  } catch (error) {
    console.error("Create expense error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while recording the expense",
    });
  }
};


const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      userId: req.userId,
    })
      .populate("productId", "name category")
      .sort({
        date: -1,
      });

    return res.status(200).json({
      success: true,
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    console.error("Get expenses error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching expenses",
    });
  }
};


const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.userId,
    }).populate(
      "productId",
      "name category"
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    return res.status(200).json({
      success: true,
      expense,
    });
  } catch (error) {
    console.error("Get expense error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the expense",
    });
  }
};


const updateExpense = async (req, res) => {
  try {
    const {
      productId,
      amount,
      type,
      description,
      date,
    } = req.body;

    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    if (productId !== undefined && productId !== null) {
      const product = await Product.findOne({
        _id: productId,
        userId: req.userId,
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      expense.productId = productId;
    }

    if (productId === null) {
      expense.productId = null;
    }

    if (amount !== undefined) {
      const amountNum = Number(amount);

      if (
        !Number.isFinite(amountNum) ||
        amountNum <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Expense amount must be greater than zero",
        });
      }

      expense.amount = amountNum;
    }

    if (type !== undefined) {
      expense.type = type;
    }

    if (description !== undefined) {
      expense.description =
        description?.trim() || "";
    }

    if (date !== undefined) {
      expense.date = date;
    }

    await expense.save();

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense,
    });
  } catch (error) {
    console.error("Update expense error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the expense",
    });
  }
};


const deleteExpense = async (req, res) => {
  try {
    const expense =
      await Expense.findOneAndDelete({
        _id: req.params.id,
        userId: req.userId,
      });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Delete expense error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the expense",
    });
  }
};


module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
};