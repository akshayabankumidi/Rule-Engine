const db = require('./db.js');
const createRulesTable = require('./tables/createRulesTable.js');


const initializeDatabase = async () => {
  const client = await db.pool.connect();
  console.log('BEGIN AST DB MIGRATION');

  try {
    await client.query('BEGIN'); // begin transaction
    
    // Create rules table
    await client.query(createRulesTable);
    console.log('Rules table created');
    await client.query('COMMIT'); // commit transaction
    console.log('END AST DB MIGRATION');
  } catch (e) {
    await client.query('ROLLBACK'); // rollback transaction
    console.error('AST DB migration failed:', e);
    throw e;
  } finally {
    client.release();
  }
};

module.exports = initializeDatabase;