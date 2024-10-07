const db = require('../config/db');

exports.getUserRole = (req, res) => {
    const email = req.query.userEmail; // Hämta e-post från query-parametern

  if (!email) {
    return res.status(400).send('Email is required');
  }

  const sql = 'SELECT Role, Email FROM Person WHERE Email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Error fetching user role:', err.message);
      return res.status(500).send('Database query failed');
    }

    if (results.length > 0) {
      res.json({ role: results[0].Role, email: results[0].Email });
    } else {
      res.status(404).send('User not found');
    }
  });
};

exports.saveUser = (req, res) => {
    const { email } = req.body;
    console.log('Received data:', email);
        // Lägg till ny användare i databasen
        const insertUserSql = 'INSERT INTO Person (Email) VALUES (?)';
        console.log('Inserting into database:', email);
        db.query(insertUserSql, [email], (err, result) => {
          if (err) {
            console.error('Error saving user:', err.message);
            return res.status(500).send(`Error saving user: ${err.message}`);
          }
          res.status(200).send('User saved successfully');
        });
      }

      exports.userPlan = (req, res) => {
        const {email} = req.query;

  if (!email) {
    return res.status(400).send('Email is required');
  }

  const sql = 'SELECT stripe_price_id FROM Person WHERE Email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Error fetching user plan:', err.message);
      return res.status(500).send('Database query failed');
    }

    if (results.length > 0) {
      const priceId = results[0].stripe_price_id;
      res.json({ plan: priceId });
    } else {
      res.status(404).send('User not found');
    }
  });
      }