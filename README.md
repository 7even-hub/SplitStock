# StockSplit

StockSplit is a bulk-to-retail inventory management system designed for Nigerian mini marts and small retailers who buy products in bulk and repackage them into smaller retail quantities.

## 🚧 Project Status

**In Development**

StockSplit is currently under active development. The backend API, authentication, inventory management, repackaging, sales, expenses, alerts, and dashboard features are being implemented progressively.

---

## 📌 The Problem

Many small retailers buy products in bulk and repackage them into smaller quantities before selling them.

For example:

> A shop buys 50kg of rice and repackages it into 1kg and 2kg portions.

Managing this manually can make it difficult to keep track of:

- Bulk inventory
- Repackaged inventory
- Wastage
- Cost per unit
- Selling prices
- Profit margins
- Sales
- Expenses
- Low-stock products
- Suppliers

StockSplit aims to bring these processes into one system.

---

## 💡 The Solution

StockSplit allows retailers to:

- Record bulk purchases
- Track suppliers
- Repackage bulk products into retail sizes
- Automatically calculate expected and actual quantities
- Track wastage
- Calculate cost per retail unit
- Record sales
- Monitor inventory
- Track expenses
- Receive low-stock alerts
- View business statistics through a dashboard

---

## 🛠️ Tech Stack

### Frontend

- React
- JavaScript
- Vite
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

---

## 📁 Project Structure

```text
StockSplit/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
