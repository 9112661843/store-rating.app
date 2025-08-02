module.exports = {
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'AS9112661843',
    database: process.env.DB_NAME || 'store_ratings',
    port: process.env.DB_PORT || 5432,
    max: 10, // Reduced connection pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000, // Increased timeout
    ssl: false // Disable SSL for local development
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-here'
  },
  server: {
    port: process.env.PORT || 5000
  }
}; 