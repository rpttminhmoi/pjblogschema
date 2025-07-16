const express = require('express');
const router = express.Router();
const db = require('../db');

// GET: lấy comment theo postId
router.get('/', async (req, res) => {
    const { postId } = req.query;
  
    if (!postId) return res.status(400).json({ error: 'Missing postId' });
  
    const result = await db.query(`
      SELECT c.id, c.content, c.post_id, c.user_id, u.username
      FROM comments c
      JOIN users u ON c.user_id::int = u.id
      WHERE c.post_id = $1
      ORDER BY c.id ASC
    `, [postId]);  // ✅ Tham số nằm ở đây
  
    res.json(result.rows);
  });
  

// POST: thêm comment mới (username nhập tay, auto tạo user)
router.post('/', async (req, res) => {
    const { postId, content, username } = req.body;
  
    if (!postId || !content || !username) {
      return res.status(400).json({ error: 'postId, content, username required' });
    }
  
    try {
      // Tra user_id từ username
      let userResult = await db.query('SELECT id FROM users WHERE username = $1', [username]);
      let user_id;
  
      if (userResult.rows.length === 0) {
        // 👇 Chỗ khác biệt: AUTO INSERT USER
        userResult = await db.query(
          'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
          [username, 'dummy']   // 👈 pass fake
        );
      }
  
      user_id = userResult.rows[0].id;
  
      // Tạo comment
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
