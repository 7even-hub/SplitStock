const mongoose = require("mongoose");

const Sale = require("../models/sales");
const RepackBatch = require("../models/repackBatch");
const Inventory = require("../models/inventory");
const Product = require("../models/product");
const Alert = require("../models/alert");


//create a new sale

const createSale = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const {
      repackBatchId,
      quantitySold,
      saleDate,
    } = req.body;

    //validate request

    if (!repackBatchId || quantitySold === undefined) {
      return res.status(400).json({
        success: false,
        message: "Repack batch and quantity sold are required",
      });
    }

    const quantitySoldNum = Number(quantitySold);

    if (
      !Number.isInteger(quantitySoldNum) ||
      quantitySoldNum <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity sold must be a positive whole number",
      });
    }

    //start transaction

    session.startTransaction();

    //verify repack batch ownership

    const batch = await RepackBatch.findOne({
      _id: repackBatchId,
      userId: req.userId,
    }).session(session);

    if (!batch) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message: "Repack batch not found",
      });
    }

    //check if there is enough stock in the batch

    if (batch.remainingUnits < quantitySoldNum) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message:
          `Insufficient stock. Only ${batch.remainingUnits} units remain.`,
      });
    }

    //verify product ownership

    const product = await Product.findOne({
      _id: batch.productId,
      userId: req.userId,
    }).session(session);

    if (!product) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    //get selling price and cost per unit from the batch

    const sellingPrice = Number(batch.sellingPrice);
    const costPerUnit = Number(batch.costPerUnit);

    //calculate total amount and profit

    const totalAmount =
      sellingPrice * quantitySoldNum;

    const profitPerUnit =
      sellingPrice - costPerUnit;

    const totalProfit =
      profitPerUnit * quantitySoldNum;

    //update repack batch stock

    const updatedBatch =
      await RepackBatch.findOneAndUpdate(
        {
          _id: repackBatchId,
          userId: req.userId,

          remainingUnits: {
            $gte: quantitySoldNum,
          },
        },
        {
          $inc: {
            remainingUnits: -quantitySoldNum,
          },
          $set: {
            status:
              batch.remainingUnits - quantitySoldNum === 0
                ? "depleted"
                : "active",
          },
        },
        {
          returnDocument: 'after',
          session,
        }
      );

    if (!updatedBatch) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message:
          "Unable to update stock. There may not be enough stock remaining.",
      });
    }

    //update inventory stock

    const updatedInventory =
      await Inventory.findOneAndUpdate(
        {
          userId: req.userId,
          productId: batch.productId,

          repackRemaining: {
            $gte: quantitySoldNum,
          },
        },
        {
          $inc: {
            repackRemaining: -quantitySoldNum,
          },
          $set: {
            lastUpdated: new Date(),
          },
        },
        {
          returnDocument: 'after',
          session,
        }
      );

    if (!updatedInventory) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message:
          "Unable to update inventory. There may not be enough retail stock.",
      });
    }

    //create sale record

    const sale = await Sale.create(
      [
        {
          userId: req.userId,
          productId: batch.productId,
          repackBatchId: batch._id,

          quantitySold: quantitySoldNum,

          sellingPrice: sellingPrice.toFixed(2),
          costPerUnit: costPerUnit.toFixed(2),

          totalAmount: totalAmount.toFixed(2),
          profit: totalProfit.toFixed(2),

          saleDate: saleDate || new Date(),
        },
      ],
      {
        session,
      }
    );

    //check for low stock alert

    const currentRetailStock =
      updatedInventory.repackRemaining;

    if (
      currentRetailStock <= product.lowStockLimit && updatedInventory.bulkRemaining == 0
    ) {
      // Avoid creating duplicate unresolved alerts
      const existingAlert = await Alert.findOne({
        userId: req.userId,
        productId: product._id,
        type: "low_stock",
        resolved: false,
      }).session(session);

      if (!existingAlert) {
        await Alert.create(
          [
            {
              userId: req.userId,
              productId: product._id,
              type: "low_stock",
              message:
                `${product.name} is low on stock. ` +
                `Only ${currentRetailStock} retail units remain.`,
              triggeredAt: new Date(),
              resolved: false,
            },
          ],
          {
            session,
          }
        );
      }
    }

    //commit transaction

    await session.commitTransaction();

    //send response

    return res.status(201).json({
      success: true,
      message: "Sale recorded successfully",

      sale: sale[0],

      stock: {
        previousUnits: batch.remainingUnits,
        soldUnits: quantitySoldNum,
        remainingUnits: updatedBatch.remainingUnits,
      },

      financials: {
        sellingPrice,
        costPerUnit,

        quantitySold: quantitySoldNum,

        totalAmount,
        profitPerUnit,
        totalProfit,
      },

      inventory: {
        repackRemaining:
          updatedInventory.repackRemaining,
        bulkRemaining:
          updatedInventory.bulkRemaining,
      },
    });
  } catch (error) {
    await session.abortTransaction();

    console.error("Create sale error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while recording the sale",
    });
  } finally {
    await session.endSession();
  }
};



const getSales = async (req, res) => {
  try {
    const sales = await Sale.find({
      userId: req.userId,
    })
      .populate("productId", "name category")
      .populate(
        "repackBatchId",
        "packageSize packageUnit sellingPrice"
      )
      .sort({
        saleDate: -1,
      });

    return res.status(200).json({
      success: true,
      count: sales.length,
      sales,
    });
  } catch (error) {
    console.error("Get sales error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching sales",
    });
  }
};




const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findOne({
      _id: req.params.id,
      userId: req.userId,
    })
      .populate("productId", "name category")
      .populate("repackBatchId");

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    return res.status(200).json({
      success: true,
      sale,
    });
  } catch (error) {
    console.error("Get sale error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the sale",
    });
  }
};


module.exports = {
  createSale,
  getSales,
  getSaleById,
};