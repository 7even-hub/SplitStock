const Alert = require("../models/alert");
const Product = require("../models/product");


const getAlerts = async (req, res) => {
  try {
    const {
      resolved,
      type,
    } = req.query;

    const filter = {
      userId: req.userId,
    };

    // Optional resolved filter
    if (resolved !== undefined) {
      filter.resolved =
        resolved === "true";
    }

    // Optional type filter
    if (type) {
      filter.type = type;
    }
    //PS:This filter wanted to take my life

    const alerts = await Alert.find(filter)
      .populate(
        "productId",
        "name category lowStockLimit"
      )
      .sort({
        triggeredAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: alerts.length,
      alerts,
    });
  } catch (error) {
    console.error("Get alerts error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching alerts",
    });
  }
};


const getAlertById = async (req, res) => {
  try {
    const alert = await Alert.findOne({
      _id: req.params.id,
      userId: req.userId,
    }).populate(
      "productId",
      "name category lowStockLimit"
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    return res.status(200).json({
      success: true,
      alert,
    });
  } catch (error) {
    console.error("Get alert error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the alert",
    });
  }
};


const resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    if (alert.resolved) {
      return res.status(400).json({
        success: false,
        message: "Alert is already resolved",
      });
    }

    alert.resolved = true;
    alert.resolvedAt = new Date();

    await alert.save();

    return res.status(200).json({
      success: true,
      message: "Alert resolved successfully",
      alert,
    });
  } catch (error) {
    console.error("Resolve alert error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while resolving the alert",
    });
  }
};


const getAlertCount = async (req, res) => {
  try {
    const count = await Alert.countDocuments({
      userId: req.userId,
      resolved: false,
    });

    return res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Get alert count error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while counting alerts",
    });
  }
};


module.exports = {
  getAlerts,
  getAlertById,
  resolveAlert,
  getAlertCount,
};