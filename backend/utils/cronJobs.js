const db = require('../config/db');
const cron = require('node-cron');

exports.runDailyJob = () => {
  cron.schedule('*/5 * * * *', () => {
    console.log('Cron job is running every 5 minutes');

    
    const sql = "UPDATE Annons SET Role = 'old' WHERE Date < (CURDATE() - INTERVAL 1 DAY)";
    console.log(`Running SQL: ${sql}`);
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error updating old ads:', err.message);
      } else {
        console.log('Old ads updated successfully');
      }
    });
  });
};