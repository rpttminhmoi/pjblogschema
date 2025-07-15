const express = require('express');
const router = express.Router();
const db = require('../db');

// GET tất cả posts + username
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT posts.*, users.username
      FROM posts
      JOIN users ON posts.user_id = users.id
      ORDER BY posts.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ error: 'Error fetching posts' });
  }
});

// Tạo post: nhận title, content, username
router.post('/', async (req, res) => {
  const { title, content, username } = req.body;

  if (!title || !content || !username) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    // Tìm user_id
    let result = await db.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );

    let user_id;
    if (result.rows.length === 0) {
      // Chưa có thì TỰ ĐỘNG TẠO user
      const insertUser = await db.query(
        'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
        [username, 'defaultpassword']
      );
      user_id = insertUser.rows[0].id;
    } else {
      user_id = result.rows[0].id;
    }

    // Tạo post
    const newPost = await db.query(
      'INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *',
      [title, content, user_id]
    );

    res.status(201).json(newPost.rows[0]);

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Xoá post
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM posts WHERE id = $1', [id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
