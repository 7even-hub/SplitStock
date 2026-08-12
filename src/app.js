require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoute");
const bulkPurchaseRoutes = require("./routes/bulkPurchaseRoutes");
const repackBatchRoutes = require("./routes/repackBatchRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "StockSplit API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/purchases", bulkPurchaseRoutes);
app.use("/api/repack-batches", repackBatchRoutes);

module.exports = app;