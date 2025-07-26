// backend/routes/api.js - Complete API for Circlo Rental
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const { getConnection } = require('../hana');

// Helper function to execute SQL queries
function executeSQL(conn, sql, params = []) {
  return new Promise((resolve, reject) => {
    conn.exec(sql, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// Helper function to get database connection
function getDBConnection() {
  return new Promise((resolve, reject) => {
    try {
      const conn = getConnection();
      setTimeout(() => resolve(conn), 500);
    } catch (err) {
      reject(err);
    }
  });
}

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// AUTH ENDPOINTS

// POST /api/auth/register - User registration
router.post('/auth/register', [
  body('name').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').isMobilePhone('en-IN').withMessage('Valid Indian phone number required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let conn;
  try {
    conn = await getDBConnection();
    
    const { name, email, password, phone, aadhaar } = req.body;

    // Check if user already exists
    const existingUser = await executeSQL(conn, 'SELECT id FROM Users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Generate user ID
    const userId = uuidv4();

    // Insert new user
    const insertSQL = `
      INSERT INTO Users (id, name, email, password_hash, phone, aadhaar_encrypted, karma_points, joined_date)
      VALUES (?, ?, ?, ?, ?, ?, 0, CURRENT_DATE)
    `;

    await executeSQL(conn, insertSQL, [
      userId, 
      name, 
      email, 
      hashedPassword, 
      phone,
      aadhaar ? Buffer.from(aadhaar).toString('base64') : null
    ]);

    // Create JWT token
    const token = jwt.sign(
      { userId, email, name }, 
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: userId, name, email, phone, karma_points: 0 }
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  } finally {
    if (conn) conn.disconnect();
  }
});

// POST /api/auth/login - User login
router.post('/auth/login', [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let conn;
  try {
    conn = await getDBConnection();
    
    const { email, password } = req.body;

    // Get user by email
    const users = await executeSQL(conn, 
      'SELECT id, name, email, password_hash, phone, karma_points FROM Users WHERE email = ?', 
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.PASSWORD_HASH);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.ID, email: user.EMAIL, name: user.NAME }, 
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.ID,
        name: user.NAME,
        email: user.EMAIL,
        phone: user.PHONE,
        karma_points: user.KARMA_POINTS
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  } finally {
    if (conn) conn.disconnect();
  }
});

// ITEM ENDPOINTS

// GET /api/items - Get all items with filters
router.get('/items', async (req, res) => {
  let conn;
  try {
    conn = await getDBConnection();
    
    const { category, location, search, page = 1, limit = 12, minPrice, maxPrice } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    const params = [];
    
    if (category) {
      whereClause += ' AND i.category = ?';
      params.push(category);
    }
    
    if (location) {
      whereClause += ' AND i.location LIKE ?';
      params.push(`%${location}%`);
    }
    
    if (search) {
      whereClause += ' AND (i.title LIKE ? OR i.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (minPrice) {
      whereClause += ' AND i.price >= ?';
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      whereClause += ' AND i.price <= ?';
      params.push(parseFloat(maxPrice));
    }
    
    const sql = `
      SELECT i.*, u.name as owner_name, u.karma_points as owner_karma,
             (SELECT AVG(CAST(rating AS DECIMAL)) FROM Reviews r WHERE r.item_id = i.id) as avg_rating,
             (SELECT COUNT(*) FROM Reviews r WHERE r.item_id = i.id) as review_count
      FROM Items i
      JOIN Users u ON i.owner_id = u.id
      ${whereClause}
      ORDER BY i.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    params.push(parseInt(limit), parseInt(offset));
    
    const items = await executeSQL(conn, sql, params);
    
    // Get total count for pagination
    const countSql = `SELECT COUNT(*) as total FROM Items i JOIN Users u ON i.owner_id = u.id ${whereClause}`;
    const countResult = await executeSQL(conn, countSql, params.slice(0, -2));
    const total = countResult[0].TOTAL;
    
    res.json({
      items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ error: 'Failed to fetch items' });
  } finally {
    if (conn) conn.disconnect();
  }
});

// GET /api/items/:id - Get single item details
router.get('/items/:id', async (req, res) => {
  let conn;
  try {
    conn = await getDBConnection();
    
    const sql = `
      SELECT i.*, u.name as owner_name, u.email as owner_email, 
             u.phone as owner_phone, u.karma_points as owner_karma,
             (SELECT AVG(CAST(rating AS DECIMAL)) FROM Reviews r WHERE r.item_id = i.id) as avg_rating,
             (SELECT COUNT(*) FROM Reviews r WHERE r.item_id = i.id) as review_count
      FROM Items i
      JOIN Users u ON i.owner_id = u.id
      WHERE i.id = ?
    `;
    
    const items = await executeSQL(conn, sql, [req.params.id]);
    
    if (items.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Get reviews
    const reviewsSql = `
      SELECT r.*, u.name as reviewer_name, u.karma_points as reviewer_karma
      FROM Reviews r
      JOIN Users u ON r.user_id = u.id
      WHERE r.item_id = ?
      ORDER BY r.created_at DESC
    `;
    
    const reviews = await executeSQL(conn, reviewsSql, [req.params.id]);

    // Get photos
    const photosSql = `
      SELECT url, photo_type FROM Photos 
      WHERE item_id = ? 
      ORDER BY uploaded_at ASC
    `;
    
    const photos = await executeSQL(conn, photosSql, [req.params.id]);
    
    res.json({
      item: items[0],
      reviews,
      photos
    });
    
  } catch (err) {
    console.error('Error fetching item:', err);
    res.status(500).json({ error: 'Failed to fetch item' });
  } finally {
    if (conn) conn.disconnect();
  }
});

// POST /api/items - Create new item (requires authentication)
router.post('/items', authenticateToken, [
  body('title').isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('description').isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  body('category').notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 1 }).withMessage('Price must be a positive number'),
  body('location').notEmpty().withMessage('Location is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let conn;
  try {
    conn = await getDBConnection();
    
    const { title, description, category, price, price_unit, location, geo_location, is_vault_item, vault_story } = req.body;
    const itemId = uuidv4();
    
    const insertSQL = `
      INSERT INTO Items (id, owner_id, title, description, category, price, price_unit, 
                        location, geo_location, is_vault_item, vault_story, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;
    
    await executeSQL(conn, insertSQL, [
      itemId,
      req.user.userId,
      title,
      description,
      category,
      parseFloat(price),
      price_unit || 'day',
      location,
      geo_location || null,
      is_vault_item ? 1 : 0,
      vault_story || null
    ]);
    
    res.status(201).json({
      message: 'Item created successfully',
      itemId
    });
    
  } catch (err) {
    console.error('Error creating item:', err);
    res.status(500).json({ error: 'Failed to create item' });
  } finally {
    if (conn) conn.disconnect();
  }
});

// BOOKING ENDPOINTS

// POST /api/bookings - Create new booking
router.post('/bookings', authenticateToken, [
  body('item_id').isUUID().withMessage('Valid item ID required'),
  body('start_date').isISO8601().withMessage('Valid start date required'),
  body('end_date').isISO8601().withMessage('Valid end date required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let conn;
  try {
    conn = await getDBConnection();
    
    const { item_id, start_date, end_date } = req.body;
    
    // Check if item exists and is not owned by the user
    const itemCheck = await executeSQL(conn, 
      'SELECT owner_id FROM Items WHERE id = ?', 
      [item_id]
    );
    
    if (itemCheck.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    if (itemCheck[0].OWNER_ID === req.user.userId) {
      return res.status(400).json({ error: 'Cannot book your own item' });
    }

    // Check for overlapping bookings
    const overlapCheck = await executeSQL(conn, `
      SELECT id FROM Bookings 
      WHERE item_id = ? 
      AND status NOT IN ('cancelled', 'rejected')
      AND (
        (start_date <= ? AND end_date >= ?) OR
        (start_date <= ? AND end_date >= ?) OR
        (start_date >= ? AND end_date <= ?)
      )
    `, [item_id, start_date, start_date, end_date, end_date, start_date, end_date]);

    if (overlapCheck.length > 0) {
      return res.status(400).json({ error: 'Item is not available for selected dates' });
    }
    
    const bookingId = uuidv4();
    
    const insertSQL = `
      INSERT INTO Bookings (id, user_id, item_id, start_date, end_date, status, payment_status, created_at)
      VALUES (?, ?, ?, ?, ?, 'pending', 'unpaid', CURRENT_TIMESTAMP)
    `;
    
    await executeSQL(conn, insertSQL, [
      bookingId,
      req.user.userId,
      item_id,
      start_date,
      end_date
    ]);
    
    res.status(201).json({
      message: 'Booking request created successfully',
      bookingId
    });
    
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ error: 'Failed to create booking' });
  } finally {
    if (conn) conn.disconnect();
  }
});

// GET /api/bookings - Get user's bookings
router.get('/bookings', authenticateToken, async (req, res) => {
  let conn;
  try {
    conn = await getDBConnection();
    
    const { type = 'renter' } = req.query; // 'renter' or 'owner'
    
    let sql;
    if (type === 'owner') {
      // Bookings for items owned by the user
      sql = `
        SELECT b.*, i.title as item_title, i.price, i.price_unit,
               u.name as renter_name, u.phone as renter_phone
        FROM Bookings b
        JOIN Items i ON b.item_id = i.id
        JOIN Users u ON b.user_id = u.id
        WHERE i.owner_id = ?
        ORDER BY b.created_at DESC
      `;
    } else {
      // Bookings made by the user
      sql = `
        SELECT b.*, i.title as item_title, i.price, i.price_unit,
               u.name as owner_name, u.phone as owner_phone
        FROM Bookings b
        JOIN Items i ON b.item_id = i.id
        JOIN Users u ON i.owner_id = u.id
        WHERE b.user_id = ?
        ORDER BY b.created_at DESC
      `;
    }
    
    const bookings = await executeSQL(conn, sql, [req.user.userId]);
    
    res.json({ bookings });
    
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  } finally {
    if (conn) conn.disconnect();
  }
});

// PUT /api/bookings/:id/status - Update booking status (for owners)
router.put('/bookings/:id/status', authenticateToken, [
  body('status').isIn(['confirmed', 'rejected', 'completed', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let conn;
  try {
    conn = await getDBConnection();
    
    const { status } = req.body;
    const bookingId = req.params.id;
    
    // Check if user owns the item for this booking
    const ownerCheck = await executeSQL(conn, `
      SELECT b.id FROM Bookings b
      JOIN Items i ON b.item_id = i.id
      WHERE b.id = ? AND i.owner_id = ?
    `, [bookingId, req.user.userId]);
    
    if (ownerCheck.length === 0) {
      return res.status(403).json({ error: 'Not authorized to update this booking' });
    }
    
    await executeSQL(conn, 
      'UPDATE Bookings SET status = ? WHERE id = ?', 
      [status, bookingId]
    );
    
    res.json({ message: 'Booking status updated successfully' });
    
  } catch (err) {
    console.error('Error updating booking:', err);
    res.status(500).json({ error: 'Failed to update booking' });
  } finally {
    if (conn) conn.disconnect();
  }
});

// REVIEW ENDPOINTS

// POST /api/reviews - Create review
router.post('/reviews', authenticateToken, [
  body('item_id').isUUID().withMessage('Valid item ID required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').isLength({ min: 10 }).withMessage('Comment must be at least 10 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let conn;
  try {
    conn = await getDBConnection();
    
    const { item_id, rating, comment } = req.body;
    
    // Check if user has a completed booking for this item
    const bookingCheck = await executeSQL(conn, `
      SELECT id FROM Bookings 
      WHERE user_id = ? AND item_id = ? AND status = 'completed'
    `, [req.user.userId, item_id]);
    
    if (bookingCheck.length === 0) {
      return res.status(400).json({ error: 'Can only review items you have rented' });
    }

    // Check if user already reviewed this item
    const existingReview = await executeSQL(conn, 
      'SELECT id FROM Reviews WHERE user_id = ? AND item_id = ?', 
      [req.user.userId, item_id]
    );
    
    if (existingReview.length > 0) {
      return res.status(400).json({ error: 'You have already reviewed this item' });
    }
    
    const reviewId = uuidv4();
    
    await executeSQL(conn, `
      INSERT INTO Reviews (id, user_id, item_id, rating, comment, created_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `, [reviewId, req.user.userId, item_id, rating, comment]);
    
    res.status(201).json({
      message: 'Review created successfully',
      reviewId
    });
    
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ error: 'Failed to create review' });
  } finally {
    if (conn) conn.disconnect();
  }
});

// USER PROFILE ENDPOINTS

// GET /api/profile - Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  let conn;
  try {
    conn = await getDBConnection();
    
    const userSql = `
      SELECT id, name, email, phone, karma_points, joined_date, avatar_url
      FROM Users WHERE id = ?
    `;
    
    const users = await executeSQL(conn, userSql, [req.user.userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's items count
    const itemsCount = await executeSQL(conn, 
      'SELECT COUNT(*) as count FROM Items WHERE owner_id = ?', 
      [req.user.userId]
    );

    // Get user's bookings count
    const bookingsCount = await executeSQL(conn, 
      'SELECT COUNT(*) as count FROM Bookings WHERE user_id = ?', 
      [req.user.userId]
    );

    const user = users[0];
    user.items_count = itemsCount[0].COUNT;
    user.bookings_count = bookingsCount[0].COUNT;
    
    res.json({ user });
    
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  } finally {
    if (conn) conn.disconnect();
  }
});

// GET /api/categories - Get all categories
router.get('/categories', async (req, res) => {
  let conn;
  try {
    conn = await getDBConnection();
    
    const sql = `
      SELECT DISTINCT category, COUNT(*) as count 
      FROM Items 
      WHERE category IS NOT NULL 
      GROUP BY category 
      ORDER BY count DESC
    `;
    
    const categories = await executeSQL(conn, sql);
    
    res.json({ categories });
    
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  } finally {
    if (conn) conn.disconnect();
  }
});

module.exports = router;