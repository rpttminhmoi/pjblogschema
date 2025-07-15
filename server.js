const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Kết nối PostgreSQL
const db = require('./db');

// Middleware để parse JSON và form
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Phục vụ file tĩnh trong thư mục public/
app.use(express.static(path.join(__dirname, 'public')));

// Route API
app.use('/api/posts', require('./routes/posts'));

// Giao diện HTML (views/index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Route cho comments
app.use('/api/comments', require('./routes/comments'));

// Khởi chạy server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
