const express = require("express");
const router = express.Router();
const { db } = require("../config/db");

// ================= GET ALL PRODUCT OUT =================
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        po.ProductOutId,
        p.ProductName,
        po.ProductCode,
        po.Date,
        po.Quantity,
        po.UnitPrice,
        po.TotalPrice
      FROM ProductOut po
      JOIN Product p ON po.ProductCode = p.ProductCode
      ORDER BY po.ProductOutId DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= ADD PRODUCT OUT (WITH STOCK CHECK) =================
router.post("/", async (req, res) => {
  try {
    const { ProductCode, Quantity, UnitPrice } = req.body;

    if (!ProductCode || !Quantity || !UnitPrice) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const qtyOutRequested = parseInt(Quantity);

    // 1. Calculate Current Stock
    const [[inRow]] = await db.query(
      "SELECT COALESCE(SUM(Quantity), 0) AS totalIn FROM productin WHERE ProductCode = ?", 
      [ProductCode]
    );
    const [[outRow]] = await db.query(
      "SELECT COALESCE(SUM(Quantity), 0) AS totalOut FROM productout WHERE ProductCode = ?", 
      [ProductCode]
    );

    const currentStock = inRow.totalIn - outRow.totalOut;

    // 2. Prevent output if stock is insufficient
    if (qtyOutRequested > currentStock) {
      return res.status(400).json({ 
        message: `Insufficient stock! Current available stock is only ${currentStock}.` 
      });
    }

    // 3. Process output transaction if valid
    const TotalPrice = qtyOutRequested * parseFloat(UnitPrice);

    await db.query(
      `INSERT INTO ProductOut 
      (ProductCode, Date, Quantity, UnitPrice, TotalPrice) 
      VALUES (?, NOW(), ?, ?, ?)`,
      [ProductCode, qtyOutRequested, UnitPrice, TotalPrice]
    );

    res.status(201).json({ message: "Product Out added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;