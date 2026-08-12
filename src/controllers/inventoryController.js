const Inventory = require("../models/inventory");


// ============================================================
// GET ALL INVENTORY
// ============================================================

const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find({
      userId: req.userId,
    })
      .populate("productId", "name category lowStockLimit")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: inventory.length,
      inventory,
    });
  } catch (error) {
    console.error("Get inventory error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching inventory",
    });
  }
};


// ============================================================
// GET INVENTORY FOR ONE PRODUCT
// ============================================================

const getProductInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findOne({
      userId: req.userId,
      productId: req.params.productId,
    }).populate(
      "productId",
      "name category lowStockLimit"
    );

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory not found for this product",
      });
    }

    return res.status(200).json({
      success: true,
      inventory,
    });
  } catch (error) {
    console.error(
      "Get product inventory error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching product inventory",
    });
  }
};


module.exports = {
  getInventory,
  getProductInventory,
};