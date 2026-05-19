// db.js

import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Create Pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  //port: process.env.DB_PORT,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test Connection using async/await
const testConnection = async () => {
  try {
    const connection = await db.getConnection();

    console.log(`Database ${process.env.DB_NAME} connected successfully`);

    connection.release();
  } catch (error) {
    console.log(`Database ${process.env.DB_NAME} connection failed`);
    console.error(error.message);
  }
};

testConnection();

export { db };