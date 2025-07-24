// backend/hana.js
require("dotenv").config();
const hana = require("@sap/hana-client");

function getConnection() {
  const conn = hana.createConnection();

  const connParams = {
    serverNode: `${process.env.HANA_HOST}:${process.env.HANA_PORT}`,
    uid: process.env.HANA_USER,
    pwd: process.env.HANA_PASSWORD,
    encrypt: "true",
    connectTimeout: 30000, // 30 seconds to handle slow trial instance startup
  };

  console.log("🔍 Attempting connection with params:", connParams);
  try {
    conn.connect(connParams, (err) => {
      if (err) throw err;
      console.log("✅ Connected to SAP HANA Cloud");
    });
    return conn;
  } catch (err) {
    console.error("❌ Connection failed:", err.message, err.stack);
    throw err;
  }
}

module.exports = { getConnection };