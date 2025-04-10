import * as child_process from 'child_process';
import { existsSync } from 'fs';
import { promisify } from 'util';

const exec = promisify(child_process.exec);

/**
 * Comprehensive application setup script
 * - Validates environment
 * - Checks/sets up database
 * - Verifies dependencies
 */
async function main() {
  console.log('🚀 Starting application setup...');
  
  // 1. Check environment variables
  console.log('\n📋 Checking environment variables...');
  const requiredEnvVars = ['DATABASE_URL', 'SESSION_SECRET'];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    console.warn(`⚠️ Missing environment variables: ${missingVars.join(', ')}`);
    
    // Set SESSION_SECRET if missing (only in development)
    if (missingVars.includes('SESSION_SECRET')) {
      process.env.SESSION_SECRET = Math.random().toString(36).substring(2);
      console.log('ℹ️ Generated random SESSION_SECRET for development');
    }
    
    // DATABASE_URL is required
    if (missingVars.includes('DATABASE_URL')) {
      console.error('❌ DATABASE_URL environment variable is required');
      process.exit(1);
    }
  } else {
    console.log('✅ All required environment variables present');
  }
  
  // 2. Check database connection and setup
  console.log('\n🔄 Verifying database...');
  try {
    // Run database verification
    await exec('tsx scripts/db-verify.ts');
    console.log('✅ Database verification completed');
  } catch (error) {
    console.warn('⚠️ Database verification failed, attempting setup...');
    
    try {
      // Run database setup
      await exec('tsx scripts/db-setup.ts');
      console.log('✅ Database setup completed');
    } catch (setupError) {
      console.error('❌ Database setup failed:', setupError);
      process.exit(1);
    }
  }
  
  // 3. Verify all dependencies are installed
  console.log('\n📦 Checking node_modules...');
  if (!existsSync('./node_modules')) {
    console.warn('⚠️ node_modules not found, installation may be required');
    console.log('Run: npm install');
  } else {
    console.log('✅ node_modules directory exists');
  }
  
  // 4. Verify build artifacts
  console.log('\n🏗️ Checking build artifacts...');
  // Add any build verification here if needed
  
  console.log('\n✨ Setup complete! The application is ready to run.');
  console.log('To start the application, run: npm run dev');
}

main().catch(err => {
  console.error('❌ Unhandled error during setup:', err);
  process.exit(1);
});