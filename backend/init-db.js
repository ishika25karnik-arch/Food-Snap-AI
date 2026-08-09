const fs = require('fs');
const path = require('path');
const pool = require('./config/db');

async function initDB() {
    try {
        console.log('Initializing database...');
        
        // Read the schema.sql file
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // Split by semicolon to get individual queries
        // Filter out empty queries or comments
        const queries = schema
            .split(';')
            .map(q => q.trim())
            .filter(q => q.length > 0 && !q.startsWith('--'));

        for (let query of queries) {
            // Some queries might still have comments inside, but basic execution is fine
            await pool.query(query);
        }
        console.log('Database initialized successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

initDB();
