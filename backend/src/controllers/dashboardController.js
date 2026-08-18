const mongoose = require("mongoose");
const Sale = require("../models/sales");
const Inventory = require("../models/inventory");
const Product = require("../models/product");
const Alert = require("../models/alert");

const getDashboard = async (req, res) => {

  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const now = new Date();

    const startOfToday = new Date(
      now.toLocaleString("en-US", {
        timeZone: "Africa/Lagos",
      })
    );

    startOfToday.setHours(0, 0, 0, 0);

    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    const sevenDaysAgo = new Date(startOfToday);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    //Todays stats
    const todayStats = await Sale.aggregate([
      {
        $match: {
          userId,
          saleDate: {
            $gte: startOfToday,
            $lt: startOfTomorrow,
          },
        },
      },
      {
        $group: {
          _id: null,

          totalSales: {
            $sum: {
              $toDouble: "$totalAmount",
            },
          },

          totalProfit: {
            $sum: {
              $toDouble: "$profit",
            },
          },

          transactions: {
            $sum: 1,
          },

          unitsSold: {
            $sum: "$quantitySold",
          },
        },
      },
    ]);

    const today = todayStats[0] || {
      totalSales: 0,
      totalProfit: 0,
      transactions: 0,
      unitsSold: 0,
    };

    //Inventory stats

    const inventoryStats = await Inventory.aggregate([
      {
        $match: {
          userId,
        },
      },
      {
        $group: {
          _id: null,

          bulkRemaining: {
            $sum: "$bulkRemaining",
          },

          repackRemaining: {
            $sum: "$repackRemaining",
          },

          productCount: {
            $sum: 1,
          },
        },
      },
    ]);

    const inventory = inventoryStats[0] || {
      bulkRemaining: 0,
      repackRemaining: 0,
      productCount: 0,
    };

    //Low stock products

    const lowStockProducts = await Inventory.aggregate([
      {
        $match: {
          userId,
        },
      },

      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },

      {
        $unwind: "$product",
      },

      {
        $match: {
          $expr: {
            $lte: [
              "$repackRemaining",
              "$product.lowStockLimit",
            ],
          },
        },
      },

      {
        $project: {
          _id: 0,

          productId: "$product._id",

          name: "$product.name",

          category: "$product.category",

          lowStockLimit: "$product.lowStockLimit",

          repackRemaining: 1,

          bulkRemaining: 1,
        },
      },

      {
        $sort: {
          repackRemaining: 1,
        },
      },

      {
        $limit: 10,
      },
    ]);

    //Unresolved alerts

    const unresolvedAlertCount =
      await Alert.countDocuments({
        userId,
        resolved: false,
      });

    //sales last 7 days

    const salesLast7Days = await Sale.aggregate([
      {
        $match: {
          userId,
          saleDate: {
            $gte: sevenDaysAgo,
          },
        },
      },

      {
        $group: {
          _id: {

            $dateToString: {
              format: "%Y-%m-%d",
              date: "$saleDate",
              timezone: "Africa/Lagos",
            },
          },

          sales: {
            $sum: {
              $toDouble: "$totalAmount",
            },
          },

          profit: {
            $sum: {
              $toDouble: "$profit",
            },
          },

          transactions: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    //Recent sales

    const recentSales = await Sale.find({
      userId,
    })
      .populate("productId", "name category")
      .populate(
        "repackBatchId",
        "packageSize packageUnit"
      )
      .sort({
        saleDate: -1,
      })
      .limit(10);

    //Top products

    const topProducts = await Sale.aggregate([
      {
        $match: {
          userId,
        },
      },

      {
        $group: {
          _id: "$productId",

          unitsSold: {
            $sum: "$quantitySold",
          },

          totalSales: {
            $sum: {
              $toDouble: "$totalAmount",
            },
          },

          totalProfit: {
            $sum: {
              $toDouble: "$profit",
            },
          },
        },
      },

      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },

      {
        $unwind: "$product",
      },

      {
        $project: {
          _id: 0,

          productId: "$product._id",

          name: "$product.name",

          category: "$product.category",

          unitsSold: 1,

          totalSales: 1,

          totalProfit: 1,
        },
      },

      {
        $sort: {
          totalProfit: -1,
        },
      },

      {
        $limit: 10,
      },
    ]);

    //Returning dashboard data to bckend

    return res.status(200).json({
      success: true,

      dashboard: {
        today: {
          sales: Number(today.totalSales || 0),
          profit: Number(today.totalProfit || 0),
          transactions: today.transactions || 0,
          unitsSold: today.unitsSold || 0,
        },

        inventory: {
          bulkRemaining: Number(
            inventory.bulkRemaining || 0
          ),

          repackRemaining: Number(
            inventory.repackRemaining || 0
          ),

          productCount:
            inventory.productCount || 0,

          lowStockCount:
            lowStockProducts.length,

          unresolvedAlertCount,
        },

        salesLast7Days: salesLast7Days.map(
          (day) => ({
            date: day._id,
            sales: Number(day.sales || 0),
            profit: Number(day.profit || 0),
            transactions:
              day.transactions || 0,
          })
        ),

        recentSales,

        lowStockProducts,

        topProducts,
      },
    });
  } catch (error) {
    console.error(
      "Dashboard error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while loading the dashboard",
    });
  }
};

module.exports = {
  getDashboard,
};