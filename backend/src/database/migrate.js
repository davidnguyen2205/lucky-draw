import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import pool from './connection.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function runMigrations() {
  try {
    console.error('🚀 Running database migrations...')

    const schemaPath = path.join(__dirname, 'schema.sql')
    const schemaSql = fs.readFileSync(schemaPath, 'utf8')

    // Split by semicolon and filter out empty statements
    const statements = schemaSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await pool.query(statement)
          console.error(`✅ Executed: ${statement.substring(0, 50)}...`)
        }
        catch (error) {
          console.warn(`⚠️  Warning executing statement: ${statement.substring(0, 50)}...`)
          console.warn('   Error:', error.message)
          // Continue with other statements
        }
      }
    }

    console.error('🎉 Database migrations completed successfully!')
  }
  catch (error) {
    console.error('❌ Migration error:', error)
    process.exit(1)
  }
  finally {
    await pool.end()
  }
}

// Run migrations if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations()
}

export default runMigrations
