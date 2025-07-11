const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();
const SECRET = 'YOUR_SECRET_KEY';

// REGISTER + auto login
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password)
      return res.status(400).json({ error: 'Username and password required' });
  
    try {
      const hashed = await bcrypt.hash(password, 10);
  
      const result = await db.query(
        'INSERT INTO users (username, password, password_plain) VALUES ($1, $2, $3) RETURNING id, username',
        [username, hashed, password]  // 👈 thêm password thô vào tham số
      );
  
      const user = result.rows[0];
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        SECRET,
        { expiresIn: '1h' }
      );
  
      res.status(201).json({ message: 'Registered & logged in', user, token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Registration failed' });
    }
  });
  

// LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: 'Username and password required' });

  try {
    const result = await db.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    const user = result.rows[0];
    if (!user) return res.status(400).json({ error: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Wrong password' });

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
