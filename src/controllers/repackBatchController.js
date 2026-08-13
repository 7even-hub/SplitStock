const mongoose = require("mongoose");

const RepackBatch = require("../models/repackBatch");
const BulkPurchase = require("../models/bulkPurchase");
const Inventory = require("../models/inventory");
const Product = require("../models/product");


//CREATE REPACK BATCH

const createRepackBatch = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const {
            bulkPurchaseId,
            packageSize,
            packageUnit,
            actualUnits,
            targetMargin,
            sellingPrice,
        } = req.body;

        //Validate request

        if (
            !bulkPurchaseId ||
            packageSize === undefined ||
            !packageUnit ||
            actualUnits === undefined ||
            targetMargin === undefined
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Bulk purchase, package size, package unit, actual units and target margin are required",
            });
        }

        //convert numeric values to numbers for validation

        const packageSizeNum = Number(packageSize);
        const actualUnitsNum = Number(actualUnits);
        const targetMarginNum = Number(targetMargin);

        // Validate numeric values

        if (
            !Number.isFinite(packageSizeNum) ||
            packageSizeNum <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Package size must be greater than zero",
            });
        }

        if (
            !Number.isInteger(actualUnitsNum) ||
            actualUnitsNum <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Actual units must be a positive whole number",
            });
        }

        if (
            !Number.isFinite(targetMarginNum) ||
            targetMarginNum < 0 ||
            targetMarginNum >= 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Target margin must be between 0 and 99.99%",
            });
        }

        // Start transaction

        session.startTransaction();

        //find the bulk purchase

        const purchase = await BulkPurchase.findOne({
            _id: bulkPurchaseId,
            userId: req.userId,
        }).session(session);

        if (!purchase) {
            await session.abortTransaction();

            return res.status(404).json({
                success: false,
                message: "Bulk purchase not found",
            });
        }

        //find the product associated with the bulk purchase

        const product = await Product.findOne({
            _id: purchase.productId,
            userId: req.userId,
        }).session(session);

        if (!product) {
            await session.abortTransaction();

            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        //find the inventory record for the product

        const inventory = await Inventory.findOne({
            userId: req.userId,
            productId: purchase.productId,
        }).session(session);

        if (!inventory) {
            await session.abortTransaction();

            return res.status(404).json({
                success: false,
                message: "Inventory record not found for this product",
            });
        }

        //get the remaining weight from the bulk purchase and inventory

        const remainingWeight = Number(
            purchase.remainingWeight
        );

        const inventoryBulkRemaining = Number(
            inventory.bulkRemaining
        );

        const purchaseWeight = Number(
            purchase.weight
        );

        //validate that there is enough stock in the bulk purchase and inventory

        if (
            !Number.isFinite(remainingWeight) ||
            remainingWeight <= 0
        ) {
            await session.abortTransaction();

            return res.status(400).json({
                success: false,
                message: "This bulk purchase has no stock remaining",
            });
        }

        if (inventoryBulkRemaining <= 0) {
            await session.abortTransaction();

            return res.status(400).json({
                success: false,
                message: "There is no bulk inventory available",
            });
        }

        //validate that the package size is not larger than the remaining stock

        const expectedUnits = Math.floor(
            remainingWeight / packageSizeNum
        );

        if (expectedUnits <= 0) {
            await session.abortTransaction();

            return res.status(400).json({
                success: false,
                message:
                    "Package size is larger than the remaining bulk stock",
            });
        }

        //calculate the processed weight based on actual units and package size

        const processedWeight =
            actualUnitsNum * packageSizeNum;

        //make sure the processed weight does not exceed the remaining weight in the bulk purchase

        if (processedWeight > remainingWeight) {
            await session.abortTransaction();

            return res.status(400).json({
                success: false,
                message:
                    `Insufficient stock. This repack requires ${processedWeight}${purchase.weightUnit}, but only ${remainingWeight}${purchase.weightUnit} remains.`,
            });
        }

        //make sure the processed weight does not exceed the remaining weight in the inventory

        if (processedWeight > inventoryBulkRemaining) {
            await session.abortTransaction();

            return res.status(400).json({
                success: false,
                message:
                    "Inventory does not have enough bulk stock for this repack",
            });
        }

        //calculate leftover weight after repack


        const leftoverWeight =
            remainingWeight - processedWeight;

        //calculate cost per unit based on the bulk purchase cost and the actual units produced


        const totalPurchaseCost = Number(purchase.totalCost);
        const originalWeight = Number(purchase.weight);

        const costPerWeightUnit =
            totalPurchaseCost / originalWeight;

        const processedCost =
            costPerWeightUnit * processedWeight;

        const costPerUnit =
            processedCost / actualUnitsNum;

        //calculate suggested selling price based on target margin

        const marginDecimal = targetMarginNum / 100;

        const suggestedSellingPrice =
            costPerUnit / (1 - marginDecimal);

        //determine final selling price based on user input or suggested price

        let finalSellingPrice =
            suggestedSellingPrice;

        if (sellingPrice !== undefined) {
            finalSellingPrice = Number(sellingPrice);

            if (
                !Number.isFinite(finalSellingPrice) ||
                finalSellingPrice <= 0
            ) {
                await session.abortTransaction();

                return res.status(400).json({
                    success: false,
                    message:
                        "Selling price must be greater than zero",
                });
            }
        }

        //calculate actual margin based on final selling price and cost per unit

        const actualMargin =
            ((finalSellingPrice - costPerUnit) /
                finalSellingPrice) *
            100;

        //deduct the processed weight from the bulk purchase's remaining weight

        const updatedPurchase =
            await BulkPurchase.findOneAndUpdate(
                {
                    _id: bulkPurchaseId,
                    userId: req.userId,

                    // !!!
                    // only update if enough stock remains
                    remainingWeight: {
                        $gte: processedWeight,
                    },
                },
                {
                    $inc: {
                        remainingWeight: -processedWeight,
                    },
                },
                {
                    new: true,
                    session,
                }
            );

        if (!updatedPurchase) {
            await session.abortTransaction();

            return res.status(400).json({
                success: false,
                message:
                    "Unable to deduct bulk stock. There may not be enough stock remaining.",
            });
        }

        //deduct the processed weight from the inventory's bulk remaining and add the actual units to the repack remaining

        const updatedInventory =
            await Inventory.findOneAndUpdate(
                {
                    userId: req.userId,
                    productId: purchase.productId,

                    // Critical:
                    // prevent inventory from going negative
                    bulkRemaining: {
                        $gte: processedWeight,
                    },
                },
                {
                    $inc: {
                        bulkRemaining: -processedWeight,
                        repackRemaining: actualUnitsNum,
                    },
                    $set: {
                        lastUpdated: new Date(),
                    },
                },
                {
                    new: true,
                    session,
                }
            );

        if (!updatedInventory) {
            await session.abortTransaction();

            return res.status(400).json({
                success: false,
                message:
                    "Unable to update inventory. There may not be enough bulk stock.",
            });
        }

        //create the repack batch record
        const repackBatch = await RepackBatch.create(
            [
                {
                    userId: req.userId,

                    productId: purchase.productId,

                    bulkPurchaseId: purchase._id,

                    packageSize: packageSizeNum,

                    packageUnit,

                    expectedUnits,

                    actualUnits: actualUnitsNum,

                    sourceWeight: remainingWeight,

                    processedWeight,

                    // !!!:
                    // leftover is not automatically considered wastage.
                    wastage: 0,

                    remainingUnits: actualUnitsNum,

                    processedCost: processedCost.toFixed(2),
                    
                    costPerUnit: costPerUnit.toFixed(2),

                    sellingPrice: finalSellingPrice.toFixed(2),

                    targetMargin: targetMarginNum,

                    status: "active",
                },
            ],
            {
                session,
            }
        );

        await session.commitTransaction();


        return res.status(201).json({
            success: true,
            message: "Repack batch created successfully",

            repackBatch: repackBatch[0],

            purchase: {
                originalWeight: purchaseWeight,
                previousRemainingWeight: remainingWeight,
                newRemainingWeight:
                    Number(updatedPurchase.remainingWeight),
            },

            inventory: {
                bulkRemaining:
                    Number(updatedInventory.bulkRemaining),

                repackRemaining:
                    Number(updatedInventory.repackRemaining),
            },

            calculations: {
                packageSize: packageSizeNum,
                packageUnit,

                expectedUnits,

                actualUnits:
                    actualUnitsNum,

                processedWeight,

                leftoverWeight,

                costPerUnit,

                targetMargin:
                    targetMarginNum,

                suggestedSellingPrice,

                finalSellingPrice,

                processedCost,

                costPerUnit,

                actualMargin:
                    Number(actualMargin.toFixed(2)),
            },
        });
    } catch (error) {

        await session.abortTransaction();

        console.error(
            "Create repack batch error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong while creating the repack batch",
        });
    } finally {
        //session close 

        await session.endSession();
    }
};


const getRepackBatches = async (req, res) => {
    try {
        const batches = await RepackBatch.find({
            userId: req.userId,
        })
            .populate(
                "productId",
                "name category"
            )
            .populate(
                "bulkPurchaseId",
                "quantity unit weight remainingWeight weightUnit totalCost purchaseDate"
            )
            .sort({
                createdAt: -1,
            });

        return res.status(200).json({
            success: true,
            count: batches.length,
            batches,
        });
    } catch (error) {
        console.error(
            "Get repack batches error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong while fetching repack batches",
        });
    }
};


const getRepackBatchById = async (req, res) => {
    try {
        const batch =
            await RepackBatch.findOne({
                _id: req.params.id,
                userId: req.userId,
            })
                .populate(
                    "productId",
                    "name category"
                )
                .populate(
                    "bulkPurchaseId"
                );

        if (!batch) {
            return res.status(404).json({
                success: false,
                message: "Repack batch not found",
            });
        }

        return res.status(200).json({
            success: true,
            batch,
        });
    } catch (error) {
        console.error(
            "Get repack batch error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong while fetching the repack batch",
        });
    }
};



module.exports = {
    createRepackBatch,
    getRepackBatches,
    getRepackBatchById,
};