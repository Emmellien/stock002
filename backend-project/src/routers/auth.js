const express = require('express');
const router = express.Router();
const {db} = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//register
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM shopkeeper WHERE username = ?', [username]);
        if (rows.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO shopkeeper (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).json({ message: 'User registered successfully' });
      const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate Input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required"
      });
    }

    // Check User
    const [rows] = await db.query(
      "SELECT * FROM Shopkeeper WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password"
      });
    }

    const user = rows[0];

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password"
      });
    }

    // Generate Token
    const token = jwt.sign(
      {
        id: user.ShopkeeperId,
        username: user.username
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    // Success Response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.ShopkeeperId,
        username: user.username
      }
    });

  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

module.exports = router;