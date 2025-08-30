import process from 'node:process'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import { v4 as uuidv4 } from 'uuid'
import pool from './database/connection.js'

// Import routes
import personsRouter from './routes/persons.js'
import prizesRouter from './routes/prizes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['http://localhost:6719', 'http://localhost:5173'] // Add your production domains
    : true,
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Session middleware - create or retrieve session
app.use('/api', async (req, res, next) => {
  try {
    let sessionId = req.headers['x-session-id']
    if (!sessionId) {
      // Create new session
      sessionId = uuidv4()
      await pool.query(
        'INSERT INTO users (session_id) VALUES ($1) ON CONFLICT (session_id) DO NOTHING',
        [sessionId]
      )
      res.setHeader('X-Session-Id', sessionId)
    } else {
      // Verify session exists
      const result = await pool.query(
        'SELECT session_id FROM users WHERE session_id = $1',
        [sessionId]
      )

      if (result.rows.length === 0) {
        // Session doesn't exist, create it
        await pool.query(
          'INSERT INTO users (session_id) VALUES ($1)',
          [sessionId]
        )
      }
    }

    req.sessionId = sessionId
    next()
  } catch (error) {
    console.error('Session middleware error:', error)
    res.status(500).json({ error: 'Session management error' })
  }
})

// Routes
app.use('/api/persons', personsRouter)
app.use('/api/prizes', prizesRouter)

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected'
    })
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    })
  }
})

// Global configuration endpoints
app.get('/api/config/:key', async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id']
    const { key } = req.params

    const result = await pool.query(
      'SELECT config_value FROM global_configs WHERE user_session_id = $1 AND config_key = $2',
      [sessionId, key]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Configuration not found' })
    }

    res.json({ success: true, data: result.rows[0].config_value })
  } catch (error) {
    console.error('Error fetching config:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/api/config/:key', async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id']
    const { key } = req.params
    const { value } = req.body

    await pool.query(`
      INSERT INTO global_configs (config_key, config_value, user_session_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (config_key, user_session_id) 
      DO UPDATE SET config_value = EXCLUDED.config_value, updated_at = CURRENT_TIMESTAMP
    `, [key, JSON.stringify(value), sessionId])

    res.json({ success: true, message: 'Configuration saved' })
  } catch (error) {
    console.error('Error saving config:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Error handling middleware
app.use((error, req, res, _next) => {
  console.error('Global error handler:', error)
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

// Start server
app.listen(PORT, () => {
  console.error(`🚀 Lucky Draw Backend Server running on port ${PORT}`)
  console.error(`📍 Health check: http://localhost:${PORT}/api/health`)
  console.error(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.error('🛑 SIGTERM received, shutting down gracefully')
  await pool.end()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.error('🛑 SIGINT received, shutting down gracefully')
  await pool.end()
  process.exit(0)
})
