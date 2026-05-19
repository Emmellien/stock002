const express = require("express");
const router = express.Router();
const { db } = require("../config/db");

// ================= GET ALL PRODUCTS WITH CURRENT STOCK =================
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.ProductCode, 
        p.ProductName, 
        p.Created_At,
        (COALESCE((SELECT SUM(Quantity) FROM productin WHERE ProductCode = p.ProductCode), 0) - 
         COALESCE((SELECT SUM(Quantity) FROM productout WHERE ProductCode = p.ProductCode), 0)) AS CurrentStock
      FROM product p
      ORDER BY p.ProductCode DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= GET PRODUCT BY ID =================
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM product WHERE ProductCode = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= CREATE NEW PRODUCT =================
router.post("/add", async (req, res) => {
  const { ProductName } = req.body;
  if (!ProductName) {
    return res.status(400).json({ message: "Product Name is required" });
  }

  try {
    await db.query("INSERT INTO product (ProductName) VALUES (?)", [ProductName]);
    res.status(201).json({ message: "Product created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= UPDATE PRODUCT BY ID =================
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { ProductName } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM product WHERE ProductCode = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    await db.query("UPDATE product SET ProductName = ? WHERE ProductCode = ?", [ProductName, id]);
    res.json({ message: "Product updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= DELETE PRODUCT BY ID =================
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM product WHERE ProductCode = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product and all historical logs removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;