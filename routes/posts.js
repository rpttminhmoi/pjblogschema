const express = require('express');
const router = express.Router();
const Posts = require('../models/posts');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const db = require('../db'); // 👈 Bạn thiếu cái này!
const SECRET = 'YOUR_SECRET_KEY';

// GET all posts (public)
router.get('/', async (req, res) => {
  try {
    const posts = await Posts.getAll();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching posts' });
  }
});

// CREATE post (protected)
router.post('/', auth, async (req, res) => {
  const { title, content } = req.body;
  const user_id = req.user.userId;

  try {
    const post = await Posts.create({ user_id, title, content });
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating post' });
  }
});

// DELETE post (protected)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    const userId = decoded.userId;

    console.log('🔑 User ID từ token:', userId); // 👉 In userId từ token

    // Kiểm tra post thuộc về user nào
    const result = await db.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const post = result.rows[0];
    console.log('📌 User ID của post:', post.user_id); // 👉 In user_id của bài post

    if (post.user_id !== userId) {
      return res.status(403).json({ error: 'Forbidden: You cannot delete this post' });
    }

    await db.query('DELETE FROM posts WHERE id = $1', [id]);
    res.json({ message: 'Post deleted successfully' });

  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Invalid token' });
  }
});


module.exports = router;
