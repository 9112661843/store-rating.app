const { Pool } = require('pg');
const config = require('./config');

async function setupDatabase() {
  console.log('Setting up PostgreSQL database...');
  
  // First, try to connect without specifying database
  const pool = new Pool({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    port: config.database.port,
    ssl: false
  });

  try {
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL successfully!');
    
    // Create database if it doesn't exist
    try {
      await client.query('CREATE DATABASE store_ratings');
      console.log('✅ Database "store_ratings" created successfully!');
    } catch (error) {
      if (error.code === '42P04') {
        console.log('✅ Database "store_ratings" already exists!');
      } else {
        console.log('⚠️  Database creation error (might already exist):', error.message);
      }
    }
    
    client.release();
    await pool.end();
    
    console.log('✅ Database setup completed!');
    console.log('🚀 You can now run: npm start');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Make sure PostgreSQL is installed and running');
    console.log('2. Check if the password is correct');
    console.log('3. Try running: pg_ctl start (if PostgreSQL is not running)');
    console.log('4. Or install PostgreSQL from: https://www.postgresql.org/download/');
  }
}

setupDatabase(); 