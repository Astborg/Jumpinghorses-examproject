const db = require('../config/db');
const cron = require('node-cron');

exports.runDailyJob = () => {
  cron.schedule('0 0 * * *', () => {
    const sql = 'UPDATE Annons SET Role = "old" WHERE Date < (CURDATE() - INTERVAL 1 DAY)';
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error updating old ads:', err.message);
      } else {
        console.log('Old ads updated successfully');
      }
    });
  });
};