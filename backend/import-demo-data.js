#!/usr/bin/env node

/**
 * Import Demo Data Script
 *
 * This script imports the default data from the frontend data.ts file into PostgreSQL.
 * It creates a demo session with sample persons, prizes, and configurations.
 *
 * Usage:
 *   node import-demo-data.js
 *
 * Prerequisites:
 *   - PostgreSQL database must be running
 *   - Database schema must be migrated (run migrate.js first)
 *   - Environment variables must be configured (.env file)
 */

import process from 'node:process'
import importData from './src/database/import-data.js'

console.error('🎲 Lucky Draw - Demo Data Import')
console.error('================================')
console.error('')

importData()
  .then(() => {
    console.error('')
    console.error('🎉 Demo data import completed successfully!')
    console.error('')
    console.error('📋 What was imported:')
    console.error('   ✓ 25 sample persons (employees)')
    console.error('   ✓ 5 prize categories')
    console.error('   ✓ Global configuration settings')
    console.error('   ✓ Music and image configurations')
    console.error('')
    console.error('🚀 Next steps:')
    console.error('   1. Start the backend server: npm start')
    console.error('   2. Use session ID "demo-session-default" in your frontend')
    console.error('   3. Access the API endpoints to see the imported data')
    console.error('')
    process.exit(0)
  })
  .catch((error) => {
    console.error('')
    console.error('❌ Demo data import failed!')
    console.error('Error:', error.message)
    console.error('')
    console.error('🔧 Troubleshooting:')
    console.error('   1. Make sure PostgreSQL is running')
    console.error('   2. Check your .env file configuration')
    console.error('   3. Run database migrations first: node src/database/migrate.js')
    console.error('')
    process.exit(1)
  })