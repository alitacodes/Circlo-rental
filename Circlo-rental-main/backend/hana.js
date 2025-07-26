// backend/hana.js - Fixed with proper async connection handling
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

  console.log("🔍 Attempting connection with params:", {
    serverNode: connParams.serverNode,
    uid: connParams.uid,
    encrypt: connParams.encrypt
  });

  conn.connect(connParams, (err) => {
    if (err) {
      console.error("❌ Connection failed:", err.message);
    } else {
      console.log("✅ Connected to SAP HANA Cloud");
    }
  });

  return conn;
}

// New function that returns a promise for proper async handling
function getConnectionAsync() {
  return new Promise((resolve, reject) => {
    const conn = hana.createConnection();

    const connParams = {
      serverNode: `${process.env.HANA_HOST}:${process.env.HANA_PORT}`,
      uid: process.env.HANA_USER,
      pwd: process.env.HANA_PASSWORD,
      encrypt: "true",
      connectTimeout: 30000,
    };

    console.log("🔍 Attempting async connection...");

    conn.connect(connParams, (err) => {
      if (err) {
        console.error("❌ Async connection failed:", err.message);
        reject(err);
      } else {
        console.log("✅ Async connected to SAP HANA Cloud");
        resolve(conn);
      }
    });
  });
}

module.exports = { getConnection, getConnectionAsync };