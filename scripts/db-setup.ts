import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from '../shared/schema';
import ws from 'ws';

// Set WebSocket for Neon database
neonConfig.webSocketConstructor = ws;

/**
 * Script to safely set up and migrate the database schema
 */
async function main() {
  // Check database connection
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is missing');
    process.exit(1);
  }

  console.log('🔄 Starting database setup...');
  
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle(pool, { schema });
    
    console.log('🔍 Checking existing schema...');
    
    // First, check if the tables already exist
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('ℹ️ Database tables already exist, skipping creation');
    } else {
      console.log('🛠️ Creating database schema...');
      
      // Create users table from our schema definition
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          avatar_url TEXT,
          reset_token TEXT,
          reset_token_expiry TEXT
        )
      `);
      
      console.log('✅ Database schema created successfully');
    }
    
    // Create sessions table for PostgreSQL session store
    console.log('🔄 Ensuring session table exists...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL,
        CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
      )
    `);
    
    console.log('✅ Database setup complete');
    pool.end();

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('❌ Unhandled error during setup:', err);
  process.exit(1);
});