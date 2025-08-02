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

async function updateAdminPassword() {
  try {
    console.log('🔄 Updating admin password to Aditya@123...\n');
    
    const newPassword = 'Aditya@123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const result = await pool.query(
      'UPDATE users SET password = $1 WHERE email = $2 AND role = $3',
      [hashedPassword, 'adi@gmail.com', 'admin']
    );
    
    if (result.rowCount > 0) {
      console.log('✅ Admin password updated successfully!');
      console.log('New admin credentials:');
      console.log('   Email: adi@gmail.com');
      console.log('   Password: Aditya@123');
    } else {
      console.log('❌ Admin user not found!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

updateAdminPassword(); 