const express = require('express');
const router = express.Router();
const Posts = require('../models/posts');

// GET /api/posts — lấy toàn bộ bài viết
router.get('/', async (req, res) => {
  try {
    const posts = await Posts.getAll();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi khi lấy bài viết' });
  }
});

// POST /api/posts — tạo bài viết mới
router.post('/', async (req, res) => {
  const { user_id, title, content } = req.body;
  try {
    const post = await Posts.create({ user_id, title, content });
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi khi tạo bài viết' });
  }
});

// DELETE /api/posts/:id — delete post by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Posts.delete(id);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting post' });
  }
});

module.exports = router;
