const mysql = require('mysql2');

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME, 
});

// Testa anslutningen
db.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database');
    connection.release(); // Släpper anslutningen tillbaka till poolen
  }
});


module.exports = db;