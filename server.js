const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const { body, validationResult } = require('express-validator');
const config = require('./config');
const path = require('path'); // Added for static file serving

const app = express();
const PORT = process.env.PORT || 5000;

// Performance and security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
app.use(compression());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://store-ratingapp.netlify.app', 'https://store-ratings-app.netlify.app'] 
    : ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // allow 50 requests per 15 minutes, then...
  delayMs: 500 // begin adding 500ms of delay per request above 50
});

app.use('/api/', limiter);
app.use('/api/', speedLimiter);

// PostgreSQL connection pool
const pool = new Pool(config.database);

// Test database connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Initialize database and create tables
const initDatabase = async () => {
  try {
    console.log('Attempting to connect to PostgreSQL...');
    
    // Test connection first with simpler config
    const testPool = new Pool({
      host: config.database.host,
      user: config.database.user,
      password: config.database.password,
      port: config.database.port,
      ssl: false,
      max: 1
    });
    
    const client = await testPool.connect();
    console.log('PostgreSQL connection successful!');
    
    // Create database if not exists
    try {
      await client.query('CREATE DATABASE store_ratings');
      console.log('Database "store_ratings" created successfully!');
    } catch (error) {
      if (error.code === '42P04') {
        console.log('Database "store_ratings" already exists!');
      } else {
        console.log('Database creation error (continuing anyway):', error.message);
      }
    }
    
    client.release();
    await testPool.end();

    // Now connect to the specific database
    const client2 = await pool.connect();
    
    // Create tables with PostgreSQL syntax
    await client2.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(60) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        address VARCHAR(400) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client2.query(`
      CREATE TABLE IF NOT EXISTS stores (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        address VARCHAR(400) NOT NULL,
        owner_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client2.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        store_id INTEGER REFERENCES stores(id),
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, store_id)
      )
    `);

    // Create indexes for better performance
    await client2.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await client2.query('CREATE INDEX IF NOT EXISTS idx_stores_owner_id ON stores(owner_id)');
    await client2.query('CREATE INDEX IF NOT EXISTS idx_ratings_store_id ON ratings(store_id)');
    await client2.query('CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings(user_id)');
    await client2.query('CREATE INDEX IF NOT EXISTS idx_ratings_created_at ON ratings(created_at)');

    // Create or update admin user
    const adminExists = await client2.query('SELECT * FROM users WHERE email = $1 OR email = $2', ['adi@gmail.com', 'admin@example.com']);
    if (adminExists.rows.length === 0) {
      // Create new admin user
      const hashedPassword = await bcrypt.hash('Adi@123', 10);
      await client2.query(
        'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5)',
        ['System Administrator', 'adi@gmail.com', hashedPassword, 'Admin Address', 'admin']
      );
      console.log('✅ Admin user created with email: adi@gmail.com');
    } else {
      // Update existing admin user
      const hashedPassword = await bcrypt.hash('Adi@123', 10);
      await client2.query(
        'UPDATE users SET email = $1, password = $2, name = $3 WHERE role = $4',
        ['adi@gmail.com', hashedPassword, 'System Administrator', 'admin']
      );
      console.log('✅ Admin user updated with new credentials');
    }
    
    client2.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error.message);
    console.log('\n🔧 Quick Fix Options:');
    console.log('1. Install PostgreSQL: https://www.postgresql.org/download/windows/');
    console.log('2. Start PostgreSQL service: net start postgresql');
    console.log('3. Check if PostgreSQL is running on port 5432');
    console.log('4. Verify password: AS9112661843');
    console.log('\n📝 Manual Setup:');
    console.log('- Install PostgreSQL');
    console.log('- Set password to: AS9112661843');
    console.log('- Create database: createdb store_ratings');
    console.log('- Then run: npm start');
  }
};

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    req.user = result.rows[0];
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Validation middleware
const validateRegistration = [
  body('name').isLength({ min: 2, max: 60 }).withMessage('Name must be 2-60 characters'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8, max: 16 }).matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/).withMessage('Password must be 8-16 chars with uppercase and special char'),
  body('address').isLength({ max: 400 }).withMessage('Address must be max 400 characters')
];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.post('/api/register', validateRegistration, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const { name, email, password, address } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await pool.query(
      'INSERT INTO users (name, email, password, address) VALUES ($1, $2, $3, $4)',
      [name, email, hashedPassword, address]
    );
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    if (error.code === '23505') { // PostgreSQL unique violation
      res.status(400).json({ message: 'Email already exists' });
    } else {
      res.status(500).json({ message: 'Registration failed' });
    }
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user.id }, config.jwt.secret, { expiresIn: '24h' });
    
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

// Admin routes
app.get('/api/admin/dashboard', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  try {
    const userCount = await pool.query('SELECT COUNT(*) as count FROM users');
    const storeCount = await pool.query('SELECT COUNT(*) as count FROM stores');
    const ratingCount = await pool.query('SELECT COUNT(*) as count FROM ratings');
    
    res.json({
      totalUsers: parseInt(userCount.rows[0].count),
      totalStores: parseInt(storeCount.rows[0].count),
      totalRatings: parseInt(ratingCount.rows[0].count)
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
});

app.get('/api/admin/users', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  try {
    const result = await pool.query(`
      SELECT u.id, u.name, u.email, u.address, u.role, u.created_at,
             AVG(r.rating) as store_rating
      FROM users u
      LEFT JOIN stores s ON u.id = s.owner_id
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY u.id, u.name, u.email, u.address, u.role, u.created_at
      ORDER BY u.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

app.get('/api/admin/stores', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  try {
    const result = await pool.query(`
      SELECT s.*, AVG(r.rating) as average_rating 
      FROM stores s 
      LEFT JOIN ratings r ON s.id = r.store_id 
      GROUP BY s.id
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stores' });
  }
});

app.post('/api/admin/users', authenticateToken, validateRegistration, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const { name, email, password, address, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5)',
      [name, email, hashedPassword, address, role || 'user']
    );
    
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    if (error.code === '23505') { // PostgreSQL unique violation
      res.status(400).json({ message: 'Email already exists' });
    } else {
      res.status(500).json({ message: 'Failed to create user' });
    }
  }
});

app.post('/api/admin/stores', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  try {
    const { name, email, address, owner_id } = req.body;
    
    await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4)',
      [name, email, address, owner_id]
    );
    
    res.status(201).json({ message: 'Store created successfully' });
  } catch (error) {
    if (error.code === '23505') { // PostgreSQL unique violation
      res.status(400).json({ message: 'Store email already exists' });
    } else {
      res.status(500).json({ message: 'Failed to create store' });
    }
  }
});

// Delete user endpoint
app.delete('/api/admin/users/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  try {
    const userId = parseInt(req.params.id);
    
    // Check if user exists
    const userExists = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is admin (prevent deleting admin)
    if (userExists.rows[0].role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin user' });
    }

    // Delete user (cascade will handle related records)
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// Delete store endpoint
app.delete('/api/admin/stores/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  try {
    const storeId = parseInt(req.params.id);
    
    // Check if store exists
    const storeExists = await pool.query('SELECT * FROM stores WHERE id = $1', [storeId]);
    if (storeExists.rows.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Delete store (cascade will handle related ratings)
    await pool.query('DELETE FROM stores WHERE id = $1', [storeId]);
    
    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete store' });
  }
});

// User routes
app.get('/api/user/stores', authenticateToken, async (req, res) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({ message: 'User access required' });
  }

  try {
    const result = await pool.query(`
      SELECT s.*, 
             AVG(r.rating) as average_rating,
             (SELECT rating FROM ratings WHERE user_id = $1 AND store_id = s.id) as user_rating
      FROM stores s 
      LEFT JOIN ratings r ON s.id = r.store_id 
      GROUP BY s.id
    `, [req.user.id]);
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stores' });
  }
});

app.put('/api/user/password', authenticateToken, async (req, res) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({ message: 'User access required' });
  }

  try {
    const { currentPassword, newPassword } = req.body;
    
    const validPassword = await bcrypt.compare(currentPassword, req.user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedNewPassword, req.user.id]);
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update password' });
  }
});

// Store owner routes
app.get('/api/store-owner/dashboard', authenticateToken, async (req, res) => {
  if (req.user.role !== 'store_owner') {
    return res.status(403).json({ message: 'Store owner access required' });
  }

  try {
    const storesResult = await pool.query('SELECT * FROM stores WHERE owner_id = $1', [req.user.id]);
    
    if (storesResult.rows.length === 0) {
      return res.status(404).json({ message: 'No store found for this user' });
    }
    
    const store = storesResult.rows[0];
    const avgRatingResult = await pool.query('SELECT AVG(rating) as avg FROM ratings WHERE store_id = $1', [store.id]);
    const ratingsResult = await pool.query(`
      SELECT r.*, u.name as user_name, u.email as user_email 
      FROM ratings r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.store_id = $1 
      ORDER BY r.created_at DESC
    `, [store.id]);
    
    res.json({
      store,
      averageRating: parseFloat(avgRatingResult.rows[0].avg) || 0,
      ratings: ratingsResult.rows
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
});

// Rating routes
app.post('/api/ratings', authenticateToken, async (req, res) => {
  try {
    const { store_id, rating } = req.body;
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    await pool.query(
      'INSERT INTO ratings (user_id, store_id, rating) VALUES ($1, $2, $3) ON CONFLICT (user_id, store_id) DO UPDATE SET rating = $3',
      [req.user.id, store_id, rating]
    );
    
    res.json({ message: 'Rating submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit rating' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Received SIGINT. Closing server and database connections...');
  pool.end();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Closing server and database connections...');
  pool.end();
  process.exit(0);
});

// Initialize database and start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}); 