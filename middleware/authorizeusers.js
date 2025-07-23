const db = require('../db');

module.exports = async (req, res, next) => {
  // Bảo vệ: xác thực phải chạy trước middleware này
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

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
    console.error(err); // log lỗi để debug
    return res.status(500).json({ error: 'Database error' });
  }
};
