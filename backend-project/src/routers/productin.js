const express = require("express");
const router = express.Router();
const {db} = require("../config/db");

// ================= GET ALL PRODUCT IN =================
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        pi.ProductInId,
        p.ProductName,
        pi.ProductCode,
        pi.Date,
        pi.Quantity,
        pi.UnitPrice,
        pi.TotalPrice
      FROM ProductIn pi
      JOIN Product p ON pi.ProductCode = p.ProductCode
      ORDER BY pi.ProductInId DESC
    `);

    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= ADD PRODUCT IN =================
router.post("/", async (req, res) => {
  try {
    const { ProductCode, Quantity, UnitPrice } = req.body;

    if (!ProductCode || !Quantity || !UnitPrice) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const TotalPrice = Quantity * UnitPrice;

    await db.query(
      `INSERT INTO ProductIn 
      (ProductCode, Date, Quantity, UnitPrice, TotalPrice) 
      VALUES (?, NOW(), ?, ?, ?)`,
      [ProductCode, Quantity, UnitPrice, TotalPrice]
    );

    res.status(201).json({
      message: "Product In added successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;