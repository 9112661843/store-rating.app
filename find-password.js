const { Pool } = require('pg');

const passwords = [
  'AS9112661843',
  'postgres',
  'password',
  'admin',
  '123456',
  '',
  'root'
];

async function testPassword(password) {
  const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: password,
    port: 5432,
    ssl: false,
    connectionTimeoutMillis: 2000
  });

  try {
    const client = await pool.connect();
    console.log(`✅ SUCCESS with password: "${password}"`);
    client.release();
    await pool.end();
    return true;
  } catch (error) {
    console.log(`❌ Failed with password: "${password}"`);
    await pool.end();
    return false;
  }
}

async function findWorkingPassword() {
  console.log('🔍 Testing different PostgreSQL passwords...\n');
  
  for (const password of passwords) {
    const success = await testPassword(password);
    if (success) {
      console.log(`\n🎉 Found working password: "${password}"`);
      console.log('Update your .env file with this password!');
      return password;
    }
  }
  
  console.log('\n❌ No working password found.');
  console.log('You need to reset your PostgreSQL password.');
  return null;
}

findWorkingPassword(); 