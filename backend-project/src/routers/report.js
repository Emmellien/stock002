const express = require("express");
const router = express.Router();
const { db } = require("../config/db");

// ================= STOCK STATUS GENERAL REPORT =================
router.get("/stock-status", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.ProductCode,
        p.ProductName,
        COALESCE(SUM(DISTINCT pi.TotalInQty), 0) AS TotalQtyIn,
        COALESCE(SUM(DISTINCT pi.TotalInValue), 0) AS TotalInValue,
        COALESCE(SUM(DISTINCT po.TotalOutQty), 0) AS TotalQtyOut,
        COALESCE(SUM(DISTINCT po.TotalOutValue), 0) AS TotalOutValue,
        (COALESCE(SUM(DISTINCT pi.TotalInQty), 0) - COALESCE(SUM(DISTINCT po.TotalOutQty), 0)) AS CurrentStock,
        (COALESCE(SUM(DISTINCT pi.TotalInValue), 0) - COALESCE(SUM(DISTINCT po.TotalOutValue), 0)) AS EstStockValue
      FROM product p
      LEFT JOIN (
        SELECT ProductCode, SUM(Quantity) AS TotalInQty, SUM(TotalPrice) AS TotalInValue 
        FROM productin GROUP BY ProductCode
      ) pi ON p.ProductCode = pi.ProductCode
      LEFT JOIN (
        SELECT ProductCode, SUM(Quantity) AS TotalOutQty, SUM(TotalPrice) AS TotalOutValue 
        FROM productout GROUP BY ProductCode
      ) po ON p.ProductCode = po.ProductCode
      GROUP BY p.ProductCode
      ORDER BY p.ProductName ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= DAILY TRANSACTION METRICS =================
router.get("/daily", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        DATE(Date) AS ReportDate,
        COALESCE((SELECT SUM(TotalPrice) FROM productin WHERE DATE(Date) = DATE(po.Date)), 0) AS TotalCostIn,
        SUM(TotalPrice) AS TotalSalesOut,
        COUNT(ProductOutId) AS SalesTransactions
      FROM productout po
      GROUP BY DATE(Date)
      ORDER BY ReportDate DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= WEEKLY TRANSACTION METRICS =================
router.get("/weekly", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        YEAR(Date) AS Year,
        WEEK(Date, 1) AS WeekNumber,
        DATE_FORMAT(MIN(Date), '%Y-%m-%d') AS WeekStartDate,
        COALESCE((SELECT SUM(TotalPrice) FROM productin WHERE WEEK(Date, 1) = WEEK(po.Date, 1) AND YEAR(Date) = YEAR(po.Date)), 0) AS TotalCostIn,
        SUM(TotalPrice) AS TotalSalesOut,
        COUNT(ProductOutId) AS SalesTransactions
      FROM productout po
      GROUP BY YEAR(Date), WEEK(Date, 1)
      ORDER BY Year DESC, WeekNumber DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= MONTHLY TRANSACTION METRICS =================
router.get("/monthly", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        MONTH(Date) AS Month,
        YEAR(Date) AS Year,
        COALESCE((SELECT SUM(TotalPrice) FROM productin WHERE MONTH(Date) = MONTH(po.Date) AND YEAR(Date) = YEAR(po.Date)), 0) AS TotalCostIn,
        SUM(TotalPrice) AS TotalSalesOut,
        COUNT(ProductOutId) AS SalesTransactions
      FROM productout po
      GROUP BY YEAR(Date), MONTH(Date)
      ORDER BY Year DESC, Month DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;