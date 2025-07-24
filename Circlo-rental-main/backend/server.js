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

app.get('/test-hana', (req, res) => {
  let conn;
  try {
    conn = getConnection();
    conn.exec('SELECT CURRENT_USER FROM DUMMY', (err, result) => {
      if (err) {
        console.error('HANA query error:', err.message);
        res.status(500).json({ error: 'Failed to connect to HANA' });
      } else {
        res.json({ hanaUser: result[0].CURRENT_USER });
      }
      if (conn) conn.disconnect();
    });
  } catch (err) {
    console.error('HANA connection error:', err.message);
    if (conn) conn.disconnect();
    res.status(500).json({ error: 'Failed to connect to HANA' });
  }
});

app.get('/test-tables', (req, res) => {
  let conn;
  try {
    conn = getConnection();
    const tables = [
      'DD5B4E13BCAD4D4290F08E97D9937BE6.Users',
      'DD5B4E13BCAD4D4290F08E97D9937BE6.Items',
      'DD5B4E13BCAD4D4290F08E97D9937BE6.Bookings',
      'DD5B4E13BCAD4D4290F08E97D9937BE6.Reviews',
      'DD5B4E13BCAD4D4290F08E97D9937BE6.Chats',
      'DD5B4E13BCAD4D4290F08E97D9937BE6.Photos'
    ];
    const results = [];

    const checkTable = (tableName, callback) => {
      conn.exec(`SELECT COUNT(*) AS count FROM ${tableName}`, (err, result) => {
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
        if (conn) conn.disconnect();
        res.json(results);
      }
    };

    nextTable();
  } catch (err) {
    console.error('Table check error:', err.message);
    if (conn) conn.disconnect();
    res.status(500).json({ error: 'Failed to check tables' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server failed to start:', err.message);
});