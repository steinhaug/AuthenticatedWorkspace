import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from '../shared/schema';
import ws from 'ws';

// Set WebSocket for Neon database
neonConfig.webSocketConstructor = ws;

/**
 * Script to verify database connectivity and schema
 */
async function main() {
  // Check database connection
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is missing');
    process.exit(1);
  }

  console.log('🔍 Verifying database connection...');
  
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    await pool.query('SELECT 1');
    console.log('✅ Database connection successful');

    // Verify tables exist by checking the 'users' table
    const db = drizzle(pool, { schema });
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

    if (tableCheck.rows[0].exists) {
      console.log('✅ Database tables exist');
    } else {
      console.log('⚠️ Database tables do not exist, schema needs to be applied');
    }

    console.log('📊 Database schema verification complete');
    pool.end();

  } catch (error) {
    console.error('❌ Database verification failed:', error);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('❌ Unhandled error during verification:', err);
  process.exit(1);
});
