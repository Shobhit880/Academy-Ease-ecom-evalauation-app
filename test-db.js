require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        
        console.log('✅ Database connection successful');
        
        // Test query
        const [rows] = await connection.execute('SELECT COUNT(*) as count FROM product_trends');
        console.log(`✅ Found ${rows[0].count} records in product_trends`);
        
        await connection.end();
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
    }
}

testConnection();
