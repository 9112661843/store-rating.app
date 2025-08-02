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

async function checkAdmin() {
  try {
    console.log('🔍 Checking admin user in database...\n');
    
    const result = await pool.query('SELECT id, name, email, password, role FROM users WHERE role = $1', ['admin']);
    
    if (result.rows.length === 0) {
      console.log('❌ No admin user found in database!');
      return;
    }
    
    const admin = result.rows[0];
    console.log('✅ Admin user found:');
    console.log(`   ID: ${admin.id}`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Password Hash: ${admin.password.substring(0, 20)}...`);
    
    // Test the password
    const testPassword = 'Adi@123';
    const isValid = await bcrypt.compare(testPassword, admin.password);
    
    console.log(`\n🔐 Testing password '${testPassword}': ${isValid ? '✅ VALID' : '❌ INVALID'}`);
    
    if (!isValid) {
      console.log('\n🔄 Updating admin password...');
      const newHash = await bcrypt.hash(testPassword, 10);
      await pool.query('UPDATE users SET password = $1 WHERE id = $2', [newHash, admin.id]);
      console.log('✅ Admin password updated successfully!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkAdmin(); 