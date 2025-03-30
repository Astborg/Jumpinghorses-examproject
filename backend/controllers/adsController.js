const db = require('../config/db');
const multer = require('multer'); // Middleware för filuppladdning
const path = require('path');

exports.getAllAds = (req, res) => {
  const sql = "SELECT * FROM Annons WHERE ROLE = 'new'";
  db.query(sql, (error, results) => {
    if (error) {
      return res.status(500).send('Error retrieving ads');
    }
    res.json(results);
  });
};

exports.getAdById = (req, res) => {
  const adId = req.params.id;
  const incrementVisitorsSql = 'UPDATE Annons SET AntalVisitors = AntalVisitors + 1 WHERE _id = ?';
  db.query(incrementVisitorsSql, [adId], (error, result) => {
    if (error) {
      return res.status(500).send('Error updating visitor count');
    }
    const getAdSql = 'SELECT * FROM Annons WHERE _id = ?';
    db.query(getAdSql, [adId], (error, result) => {
      if (error) {
        return res.status(500).send('Error retrieving ad details');
      }
      res.json(result[0]);
    });
  });
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads/'); // Se till att denna sökväg är korrekt
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Skapar ett unikt filnamn
    }
  });
  
  
  const upload = multer({ storage: storage });
  
exports.newAd = (req, res) => {
  console.log("Inkommande request body:", req.body);
    const { Rubrik, Storlek, Date, Pris, Beskrivning, Gender, Age, Height, Far, Morfar, Level, Stad, Xray, Person_id, extraLink, youtubeLink  } = req.body;
  const Bild = req.file ? req.file.filename : null;
  const AntalVisitors = parseInt(req.body.AntalVisitors, 10);
  const Role = 'new'
  const sql = 'INSERT INTO Annons (Rubrik, Storlek, Date, Pris, Beskrivning, Gender, Age, Height, Far, Morfar, Level, Stad, Xray, AntalVisitors, Person_id, Bild, Link, Role, YoutubeLink) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [Rubrik, Storlek, Date, Pris, Beskrivning, Gender, Age, Height, Far, Morfar, Level, Stad, Xray, AntalVisitors, Person_id, Bild, extraLink, Role, youtubeLink];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error saving ad:', err);
      return res.status(500).send('Error saving ad');
    }
    res.status(200).send('Ad saved successfully');
  });
}

exports.adCount = (req, res) => {
    const personId = req.query.personId; // Hämta personId från query-parametern
  
  if (!personId) {
    return res.status(400).send('Person ID is required');
  }

  const sql = 'SELECT COUNT(*) AS adCount FROM Annons WHERE Person_id = ?';
  db.query(sql, [personId], (err, results) => {
    if (err) {
      console.error('Error fetching ad count:', err.message);
      return res.status(500).send('Database query failed');
    }

    res.json({ adCount: results[0].adCount });
  });
}

exports.myAds = (req, res) => {
    const userEmail = req.query.email; // Hämta användarens email från query-parametrar
  
    if (!userEmail) {
      return res.status(400).send('Email is required');
    }
  
    // Antag att Person_id är kopplat till användarens e-post i tabellen Person
    const sql = `
      SELECT * FROM Annons 
WHERE Person_id IN (SELECT Email FROM Person WHERE Email = ?)
    `;
  
    db.query(sql, [userEmail], (err, results) => {
      if (err) {
        console.error('Error fetching ads:', err.message);
        return res.status(500).send('Database query failed');
      }
  
      if (results.length > 0) {
        res.json(results); // Returnera alla annonser som tillhör användaren
      } else {
        res.status(404).send('No ads found for this user');
      }
    });

}

exports.updateAd = (req, res) => {
   
  const { _id, Rubrik, Storlek, Pris, Beskrivning, Gender, Age, Height, Far, Morfar, Level, Stad, Xray, Link, YoutubeLink, Role } = req.body; // Data från frontend

  const sql = `
      UPDATE Annons 
      SET Rubrik = ?, Storlek = ?, Pris = ?, Beskrivning = ?, Gender = ?, Age = ?, Height = ?, Far = ?, Morfar = ?, Level = ?, Stad = ?, Xray = ?, Link = ?, YoutubeLink = ?, Role = ?
      WHERE _id = ?
  `;

  const values = [Rubrik, Storlek, Pris, Beskrivning, Gender, Age, Height, Far, Morfar, Level, Stad, Xray, Link, YoutubeLink, Role, _id];

  db.query(sql, values, (err, result) => {
      if (err) {
          console.error('Error updating ad:', err);
          return res.status(500).send('Error updating ad');
      }
      res.status(200).send('Ad updated successfully');
  });
};

exports.deleteAd = (req, res) => {
  const { _id } = req.body; // Hämtar ID från body, inte URL

  const sql = 'DELETE FROM Annons WHERE _id = ?';

  db.query(sql, [_id], (err, result) => {
    if (err) {
      console.error('Error deleting ad:', err);
      return res.status(500).send('Error deleting ad');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('Ad not found');
    }

    res.status(200).send('Ad deleted successfully');
  });
};