import express from 'express'
import { body, validationResult } from 'express-validator'
import pool from '../database/connection.js'

const router = express.Router()

// Get all persons for a session
router.get('/', async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id']
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID required' })
    }

    const result = await pool.query(
      'SELECT * FROM persons WHERE user_session_id = $1 ORDER BY id',
      [sessionId],
    )

    res.json({
      success: true,
      data: result.rows,
    })
  } catch (error) {
    console.error('Error fetching persons:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create or update multiple persons (bulk import)
router.post('/bulk', [
  body('persons').isArray().withMessage('Persons must be an array'),
  body('persons.*.name').notEmpty().withMessage('Name is required'),
  body('persons.*.uid').notEmpty().withMessage('UID is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const sessionId = req.headers['x-session-id']
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID required' })
    }

    const { persons } = req.body
    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      // Clear existing persons for this session
      await client.query('DELETE FROM persons WHERE user_session_id = $1', [sessionId])

      // Insert new persons
      for (const person of persons) {
        await client.query(`
          INSERT INTO persons (uid, name, department, identity, avatar, x, y, is_win, user_session_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
          person.uid,
          person.name,
          person.department || '',
          person.identity || '',
          person.avatar || '',
          person.x || 0,
          person.y || 0,
          person.isWin || false,
          sessionId,
        ])
      }

      await client.query('COMMIT')
      res.json({ success: true, message: `${persons.length} persons imported successfully` })
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error bulk importing persons:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update person (mark as winner, etc.)
router.put('/:id', [
  body('isWin').optional().isBoolean(),
  body('prizeName').optional().isString(),
  body('prizeTime').optional().isISO8601(),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const sessionId = req.headers['x-session-id']
    const { id } = req.params
    const updates = req.body

    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 3}`)
      .join(', ')

    const values = [sessionId, id, ...Object.values(updates)]

    const result = await pool.query(`
      UPDATE persons 
      SET ${setClause}, update_time = CURRENT_TIMESTAMP
      WHERE user_session_id = $1 AND id = $2
      RETURNING *
    `, values)

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Person not found' })
    }

    res.json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('Error updating person:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete person
router.delete('/:id', async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id']
    const { id } = req.params

    const result = await pool.query(
      'DELETE FROM persons WHERE user_session_id = $1 AND id = $2 RETURNING *',
      [sessionId, id],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Person not found' })
    }

    res.json({ success: true, message: 'Person deleted successfully' })
  } catch (error) {
    console.error('Error deleting person:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Reset all lottery results (remove winners)
router.post('/reset-lottery', async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id']

    await pool.query(`
      UPDATE persons 
      SET is_win = false, update_time = CURRENT_TIMESTAMP
      WHERE user_session_id = $1
    `, [sessionId])

    // Also clear lottery results
    await pool.query('DELETE FROM lottery_results WHERE user_session_id = $1', [sessionId])

    res.json({ success: true, message: 'Lottery results reset successfully' })
  } catch (error) {
    console.error('Error resetting lottery:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
