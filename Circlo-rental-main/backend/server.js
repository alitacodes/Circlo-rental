// backend/server.js - Updated with complete API
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { getConnection, getConnectionAsync } = require('./hana');
const apiRoutes = require('./routes/api');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Circlo Rental API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Database connection test
app.get('/test-hana', async (req, res) => {
  let conn;
  try {
    const { getConnectionAsync } = require('./hana');
    conn = await getConnectionAsync();
    
    // Execute test query
    conn.exec('SELECT CURRENT_USER FROM DUMMY', (err, result) => {
      if (err) {
        console.error('HANA query error:', err.message);
        res.status(500).json({ 
          error: 'Query failed', 
          details: err.message 
        });
      } else {
        res.json({ 
          hanaUser: result[0].CURRENT_USER,
          status: 'Connected and query executed successfully',
          timestamp: new Date().toISOString()
        });
      }
      if (conn) conn.disconnect();
    });
  } catch (err) {
    console.error('HANA connection error:', err.message);
    if (conn) conn.disconnect();
    res.status(500).json({ 
      error: 'Failed to connect to HANA', 
      details: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Tables status check
app.get('/test-tables', async (req, res) => {
  let conn;
  try {
    const { getConnectionAsync } = require('./hana');
    conn = await getConnectionAsync();
    
    const tables = ['Users', 'Items', 'Bookings', 'Reviews', 'Chats', 'Photos'];
    const results = [];

    const checkTable = (tableName) => {
      return new Promise((resolve) => {
        conn.exec(`SELECT COUNT(*) AS count FROM ${tableName}`, (err, result) => {
          if (err) {
            results.push({ table: tableName, status: 'Error', error: err.message });
          } else {
            results.push({ table: tableName, status: 'OK', count: result[0].COUNT });
          }
          resolve();
        });
      });
    };

    // Check all tables
    for (const table of tables) {
      await checkTable(table);
    }

    res.json({ 
      database: 'SAP HANA Cloud',
      tables: results,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error('Table check error:', err.message);
    res.status(500).json({ 
      error: 'Failed to check tables', 
      details: err.message,
      timestamp: new Date().toISOString()
    });
  } finally {
    if (conn) conn.disconnect();
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Circlo Rental API Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/`);
  console.log(`🧪 Database test: http://localhost:${PORT}/test-hana`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err.message);
});