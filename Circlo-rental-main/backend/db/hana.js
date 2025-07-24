const hana = require('@sap/hana-client');

function getConnection() {
  return hana.createConnection({
    serverNode: `${process.env.HANA_HOST}:${process.env.HANA_PORT}`,
    uid: process.env.HANA_USER,
    pwd: process.env.HANA_PASSWORD
  });
}

module.exports = { getConnection };
