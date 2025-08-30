import express from 'express'
import { body, validationResult } from 'express-validator'
import pool from '../database/connection.js'

const router = express.Router()

// Get all prizes for a session
router.get('/', async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id']
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID required' })
    }

    const result = await pool.query(
      'SELECT * FROM prizes WHERE user_session_id = $1 ORDER BY sort_order',
      [sessionId]
    )

    res.json({
      success: true,
      data: result.rows.map(row => ({
        id: row.id,
        name: row.name,
        sort: row.sort_order,
        isAll: row.is_all,
        count: row.count,
        isUsedCount: row.is_used_count,
        picture: {
          id: row.picture_id,
          name: row.picture_name,
          url: row.picture_url
        },
        separateCount: {
          enable: row.separate_count_enable,
          countList: row.separate_count_list
        },
        desc: row.description,
        isShow: row.is_show,
        isUsed: row.is_used,
        frequency: row.frequency
      }))
    })
  } catch (error) {
    console.error('Error fetching prizes:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create or update prize
router.post('/', [
  body('id').notEmpty().withMessage('Prize ID is required'),
  body('name').notEmpty().withMessage('Prize name is required'),
  body('count').isInt({ min: 1 }).withMessage('Count must be at least 1')
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

    const {
      id,
      name,
      sort = 1,
      isAll = false,
      count = 1,
      isUsedCount = 0,
      picture = {},
      separateCount = {},
      desc = '',
      isShow = true,
      isUsed = false,
      frequency = 1,
    } = req.body

    const result = await pool.query(`
      INSERT INTO prizes (
        id, name, sort_order, is_all, count, is_used_count,
        picture_id, picture_name, picture_url,
        separate_count_enable, separate_count_list,
        description, is_show, is_used, frequency, user_session_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        sort_order = EXCLUDED.sort_order,
        is_all = EXCLUDED.is_all,
        count = EXCLUDED.count,
        is_used_count = EXCLUDED.is_used_count,
        picture_id = EXCLUDED.picture_id,
        picture_name = EXCLUDED.picture_name,
        picture_url = EXCLUDED.picture_url,
        separate_count_enable = EXCLUDED.separate_count_enable,
        separate_count_list = EXCLUDED.separate_count_list,
        description = EXCLUDED.description,
        is_show = EXCLUDED.is_show,
        is_used = EXCLUDED.is_used,
        frequency = EXCLUDED.frequency,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [
      id,
      name,
      sort,
      isAll,
      count,
      isUsedCount,
      picture.id || '',
      picture.name || '',
      picture.url || '',
    ])

    res.json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('Error saving prize:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update prize (mark as used, increment used count, etc.)
router.put('/:id', async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id']
    const { id } = req.params
    const updates = req.body

    // Convert frontend field names to database field names
    const fieldMapping = {
      isUsedCount: 'is_used_count',
      isUsed: 'is_used',
      isAll: 'is_all',
      isShow: 'is_show',
      sortOrder: 'sort_order'
    }

    const setClause = []
    const values = [sessionId, id]
    let paramIndex = 3

    Object.entries(updates).forEach(([key, value]) => {
      const dbField = fieldMapping[key] || key
      setClause.push(`${dbField} = $${paramIndex}`)
      values.push(value)
      paramIndex++
    })

    if (setClause.length === 0) {
      return res.status(400).json({ error: 'No fields to update' })
    }

    const result = await pool.query(`
      UPDATE prizes 
      SET ${setClause.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE user_session_id = $1 AND id = $2
      RETURNING *
    `, values)

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Prize not found' })
    }

    res.json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('Error updating prize:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete prize
router.delete('/:id', async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id']
    const { id } = req.params

    const result = await pool.query(
      'DELETE FROM prizes WHERE user_session_id = $1 AND id = $2 RETURNING *',
      [sessionId, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Prize not found' })
    }

    res.json({ success: true, message: 'Prize deleted successfully' })
  } catch (error) {
    console.error('Error deleting prize:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Reset all prizes (mark as unused)
router.post('/reset', async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id']

    await pool.query(`
      UPDATE prizes 
      SET is_used = false, is_used_count = 0, updated_at = CURRENT_TIMESTAMP
      WHERE user_session_id = $1
    `, [sessionId])

    res.json({ success: true, message: 'All prizes reset successfully' })
  } catch (error) {
    console.error('Error resetting prizes:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
