const express = require('express');
const router = express.Router();
const db = require('../db');

// GET: lấy comment theo postId
router.get('/', async (req, res) => {
  const { postId } = req.query;
  if (!postId) {
    return res.status(400).json({ error: 'postId is required' });
  }

  try {
    const result = await db.query(
      'SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at ASC',
      [postId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ error: 'Error fetching comments' });
  }
});

// POST: thêm comment mới (user_id nhập tay)
router.post('/', async (req, res) => {
    const { postId, content, username } = req.body;
  
    if (!postId || !content || !username) {
      return res.status(400).json({ error: 'postId, content, username required' });
    }
  
    // Tra user_id từ username
    const userResult = await db.query('SELECT id FROM users WHERE username = $1', [username]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Username not found' });
    }
    const user_id = userResult.rows[0].id;
  
    try {
      const result = await db.query(
        'INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
        [postId, user_id, content]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error creating comment:', err);
      res.status(500).json({ error: 'Error creating comment' });
    }
  });  

module.exports = router;
