// backend/hana.js
const hana = require('@sap/hana-client');
require('dotenv').config();

const connParams = {
  serverNode: process.env.HANA_SERVER, // e.g. 'host:port'
  uid: process.env.HANA_USER,
  pwd: process.env.HANA_PASSWORD,
  // Add other params as needed (e.g. encrypt, sslValidateCertificate)
};

function getConnection() {
  const conn = hana.createConnection();
  conn.connect(connParams);
  return conn;
}

module.exports = { getConnection };