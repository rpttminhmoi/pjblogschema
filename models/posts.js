const db = require('../db');

const Posts = {
  async getAll() {
    const result = await db.query(`
      SELECT 
        posts.id,
        posts.title,
        posts.content,
        posts.user_id,
        users.username
      FROM posts
      JOIN users ON posts.user_id::integer = users.id
    `);
    return result.rows;
  },

  async create({ user_id, title, content }) {
    const result = await db.query(
      `INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3) RETURNING *`,
      [user_id, title, content]
    );
    return result.rows[0];
  },

  async delete(id) {
    return db.query(`DELETE FROM posts WHERE id = $1`, [id]);
  }
};

module.exports = Posts;
