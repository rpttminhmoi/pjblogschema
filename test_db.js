const db = require('./db');

(async () => {
  try {
    const result = await db.query('SELECT NOW()');
    console.log('✅ Kết nối thành công:', result.rows[0]);
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi kết nối database:', err.message);
    process.exit(1);
  }
})();
