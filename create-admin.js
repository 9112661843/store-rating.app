const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'AS9112661843',
  database: 'store_ratings',
  port: 5432,
  ssl: false
});

async function createAdmin() {
  try {
    console.log('🔄 Creating new admin user...\n');
    
    // Delete existing admin users
    await pool.query('DELETE FROM users WHERE role = $1', ['admin']);
    console.log('✅ Cleared existing admin users');
    
    // Create new admin user
    const adminEmail = 'admin@admin.com';
    const adminPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5)',
      ['Admin User', adminEmail, hashedPassword, 'Admin Address', 'admin']
    );
    
    console.log('✅ New admin user created successfully!');
    console.log('\n📧 Admin Login Credentials:');
    console.log('   Email: admin@admin.com');
    console.log('   Password: admin123');
    console.log('\n🔗 Login at: http://localhost:3000');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

createAdmin(); 