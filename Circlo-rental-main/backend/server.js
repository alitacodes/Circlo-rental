// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { getConnection } = require('./hana');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Circlo backend is running!');
});

// Test SAP HANA connection endpoint
app.get('/test-hana', (req, res) => {
  let conn;
  try {
    conn = getConnection();
    conn.exec('SELECT CURRENT_USER FROM DUMMY', (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ hanaUser: result[0].CURRENT_USER });
      }
      conn.disconnect();
    });
  } catch (err) {
    if (conn) conn.disconnect();
    res.status(500).json({ error: err.message });
  }
});

// backend/server.js (add to existing code)
app.get('/test-tables', (req, res) => {
  let conn;
  try {
    conn = getConnection();
    const tables = ['Users', 'Items', 'Bookings', 'Reviews', 'Chats', 'Photos'];
    const results = [];

    const checkTable = (tableName, callback) => {
      conn.exec(`SELECT COUNT(*) AS count FROM "${tableName}"`, (err, result) => {
        if (err) {
          results.push({ table: tableName, status: 'Not found', error: err.message });
        } else {
          results.push({ table: tableName, status: 'Exists', count: result[0].count });
        }
        callback();
      });
    };

    let index = 0;
    const nextTable = () => {
      if (index < tables.length) {
        checkTable(tables[index], () => {
          index++;
          nextTable();
        });
      } else {
        conn.disconnect();
        res.json(results);
      }
    };

    nextTable();
  } catch (err) {
    if (conn) conn.disconnect();
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
