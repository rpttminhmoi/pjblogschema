const db = require('../db');

module.exports = async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.user.userId;

  try {
    const result = await db.query('SELECT * FROM posts WHERE id = $1', [postId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const post = result.rows[0];
    if (post.user_id !== userId) {
      return res.status(403).json({ error: 'You cannot modify this post' });
    }

    next();
  } catch (err) {
    return res.status(500).json({ error: 'DB error' });
  }
};
