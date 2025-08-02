const { Pool } = require('pg');

async function testConnection() {
  console.log('Testing PostgreSQL connection...');
  
  const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'AS9112661843',
    port: 5432,
    ssl: false
  });

  try {
    const client = await pool.connect();
    console.log('✅ SUCCESS: Connected to PostgreSQL!');
    
    const result = await client.query('SELECT version()');
    console.log('PostgreSQL Version:', result.rows[0].version);
    
    client.release();
    await pool.end();
    
    console.log('✅ Connection test successful!');
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('password authentication failed')) {
      console.log('\n🔧 Password issue detected!');
      console.log('Try these solutions:');
      console.log('1. Check if password is correct: AS9112661843');
      console.log('2. Reset PostgreSQL password:');
      console.log('   - Open pgAdmin');
      console.log('   - Right-click on PostgreSQL server');
      console.log('   - Properties -> Connection -> Password');
      console.log('   - Set password to: AS9112661843');
    }
    
    return false;
  }
}

testConnection(); 