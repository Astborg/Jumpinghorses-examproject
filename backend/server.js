const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const { expressjwt: jwt } = require('express-jwt'); 
const jwksRsa = require('jwks-rsa');

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Middleware för att verifiera JWT
const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 50,
      jwksUri: 'https://dev-750v23phcwvolq52.us.auth0.com/.well-known/jwks.json',
    }),
    audience: 'https://dev-750v23phcwvolq52.us.auth0.com/api/v2/',
    issuer: 'https://dev-750v23phcwvolq52.us.auth0.com',
    algorithms: ['RS256'],
  });
  
  // Skydda en privat rutt
  app.get('/protected', checkJwt, (req, res) => {
    res.send('Detta är en skyddad rutt!');
  });

  const db = mysql.createPool({
    host: 'localhost',
    port: 3307, // Your MySQL host
    user: 'root',      // Your MySQL username
    password: 'notSecureChangeMe',  // Your MySQL password
    database: 'JS', // Your database name
  });

  app.get('/ads', (req, res) => {
    const sql = 'SELECT * FROM Annons';
    db.query(sql, (error, results) => {
      if (error) {
        return res.status(500).send('Error retrieving ads');
      }
      res.json(results);
    });
  });
  app.get('/ads/:id', (req, res) => {
    const adId = req.params.id;
    const sql = 'SELECT * FROM Annons WHERE _id = ?';
    db.query(sql, [adId], (error, result) => {
      if (error) {
        return res.status(500).send('Error retrieving ad details');
      }
      res.json(result[0]);
    });
  });
  
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});