const db = require('../db');

module.exports = {
  async getAll() {
    const result = await db.query('SELECT * FROM posts ORDER BY created_at DESC');
    return result.rows;
  },

  async create({ user_id, title, content }) {
    const result = await db.query(
      'INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
      [user_id, title, content]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await db.query('DELETE FROM posts WHERE id = $1', [id]);
    return result;
  }
};
