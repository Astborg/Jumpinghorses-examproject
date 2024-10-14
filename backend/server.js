require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const adsRoutes = require('./routes/adsRoutes');
const userRoutes = require('./routes/userRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const { runDailyJob } = require('./utils/cronJobs');
const { expressjwt: jwt } = require('express-jwt'); 
const jwksRsa = require('jwks-rsa');
const axios = require('axios');
const db = require('../config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors({
  origin: 'https://jumpinghorses-examproject-alva.vercel.app',
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// Serve static files like uploaded images
app.use('/uploads', express.static('uploads'));

// Routes setup
app.use('/api', adsRoutes);             // All ad-related routes
app.use('/api', userRoutes);            // User-related routes (e.g. get user role)
app.use('/api', subscriptionRoutes);    // Subscription management routes (e.g. Stripe integration)
app.use('/api', webhookRoutes);         // Stripe webhook routes for handling subscription events

// Start cron jobs for automated tasks (like marking ads as old)
runDailyJob();

// Test route (can be removed)
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});



app.get('/geocode', async (req, res) => {
  const { city } = req.query;
  const apiKey = 'AIzaSyDbemniGBYZxAwRvuCbMkcmzh56zH2fgF4'; // Replace with your Google Maps API key
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=AIzaSyDbemniGBYZxAwRvuCbMkcmzh56zH2fgF4`;
  
  try {
    const response = await axios.get(geocodeUrl);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching geocode:', error);
    res.status(500).send('Error fetching geocode');
  }
});

app.get('/test-db', async (req, res) => {
  db.query('SELECT 1 + 1 AS solution', (error, results) => {
    if (error) {
      return res.status(500).send('Error connecting to the database');
    }
    res.json({ message: 'Database connection works', results });
  });
});


// // require('dotenv').config();
// // const express = require('express');
// // const cors = require('cors');
// // const bodyParser = require('body-parser');
// // const adsRoutes = require('./routes/adsRoutes');
// // const userRoutes = require('./routes/userRoutes');
// // const subscriptionRoutes = require('./routes/subscriptionRoutes');
// // const webhookRoutes = require('./routes/webhookRoutes');
// // const { runDailyJob } = require('./utils/cronJobs');
// // const app = express();
// // const PORT = process.env.PORT || 5000;

// // app.use(cors());
// // app.use(bodyParser.json());
// // app.use('/api', adsRoutes);
// // app.use('/api', userRoutes);
// // app.use('/api', subscriptionRoutes);
// // app.use('/api', webhookRoutes);

// // runDailyJob(); // Start the cron job

// // app.listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
// // });




// const express = require('express');
// const mysql = require('mysql2');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const PORT = process.env.PORT || 5000;
// const { expressjwt: jwt } = require('express-jwt'); 
// const jwksRsa = require('jwks-rsa');
// const multer = require('multer'); // Middleware för filuppladdning
// const path = require('path');
// const stripe = require('stripe')('sk_test_51P1AxTEGk7e8lKhx7d8y2sc3geuObxXKTbjWemfNXaEJosBs8fj1EmLxuveN4JeWHwM3VrPxLm8mqgc9XTjisWE900uDyo1qYN'); 
// const axios = require('axios');
// const app = express();


// const db = mysql.createPool({
//   host: 'localhost',
//   port: 3307, // Your MySQL host
//   user: 'root',      // Your MySQL username
//   password: 'notSecureChangeMe',  // Your MySQL password
//   database: 'JS', // Your database name
// });

// const endpointSecret = 'whsec_9cb9ee33b209dd6195fcf89af36cd06c3f2681f1753b955b85038676c226e49c';
// app.post('/webhook', bodyParser.raw({ type: 'application/json' }), (req, res) => {
//   const sig = req.headers['stripe-signature'] 
  
//    // Replace with your webhook signing secret

//   let event = req.body;

//   try {
//     // Construct the event using the raw body and signature
//     event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//   } catch (err) {
//     console.error('Webhook signature verification failed:', err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   // Handle the event type
//   if (event.type === 'checkout.session.completed') {
//     const session = event.data.object;
//     console.log('Checkout session completed:', session);
    
//   const customerId = session.customer; // Stripe customer ID
//   const subscriptionId = session.subscription; // Stripe subscription ID
//   const email = session.customer_details.email
//   console.log(customerId, subscriptionId)
//   const role = 'subscriber';
//   // You can use the customer ID to find the user in your database
//   // and update their record with the subscription details and role
//   const checkUserSql = 'SELECT * FROM Person WHERE Email = ?';
//   db.query(checkUserSql, [email], (err, results) => {
//     if (err) {
//       console.error('Error checking user in the database:', err.message);
//       return res.status(500).send('Database query failed');
//     }

//     if (results.length > 0) {
//       // User exists, update the existing record
//       const updateUserSql = 'UPDATE Person SET stripe_customer_id = ?, stripe_subscription_id = ?, Role = ? WHERE Email = ?';
//       db.query(updateUserSql, [customerId, subscriptionId, role, email], (err, result) => {
//         if (err) {
//           console.error('Error updating user in the database:', err.message);
//           return res.status(500).send('Database update failed');
//         }
//         console.log('User updated successfully');
//       });
//     } else {
//       // User doesn't exist, insert a new record
//       const insertUserSql = 'INSERT INTO Person (Email, stripe_customer_id, stripe_subscription_id, Role) VALUES (?, ?, ?, ?)';
//       db.query(insertUserSql, [email, customerId, subscriptionId, role], (err, result) => {
//         if (err) {
//           console.error('Error saving new user in the database:', err.message);
//           return res.status(500).send('Database insert failed');
//         }
//         console.log('New user added successfully');
//       });
//     }
//   });
// }   else if (event.type === 'invoice.payment_failed') {
//   // Hantera betalningsfel
//   const invoice = event.data.object;
//   const email = invoice.customer_email; // Hämta kundens e-post från fakturan

//   console.log('Payment failed for invoice:', invoice.id);

//   // Uppdatera rollen till 'failure'
//   const updateFailureSql = 'UPDATE Person SET Role = ? WHERE Email = ?';
//   db.query(updateFailureSql, ['failure', email], (err, result) => {
//     if (err) {
//       console.error('Error updating user role to failure:', err.message);
//       return res.status(500).send('Database update failed');
//     }
//     console.log('User role updated to failure successfully');
//   });
// } else if (event.type === 'customer.subscription.deleted') {
//   const subscription = event.data.object;
//   const stripeSubscriptionId = subscription.id;
//   const email = subscription.metadata.email; // Om du har sparat e-post som metadata
  
//   // Uppdatera rollen i databasen till 'failure'
//   const updateUserSql = 'UPDATE Person SET Role = ? WHERE stripe_subscription_id = ?';
//   db.query(updateUserSql, ['failure', stripeSubscriptionId], (err, result) => {
//     if (err) {
//       console.error('Error updating user role in the database:', err.message);
//       return res.status(500).send('Database update failed');
//     }
//     console.log(`User role updated to failure for subscription: ${stripeSubscriptionId}`);
//   });
//   const deleteAdsSql = 'DELETE FROM Annons WHERE Person_id = (SELECT Email FROM Person WHERE stripe_subscription_id = ?)';
//   db.query(deleteAdsSql, [stripeSubscriptionId], (err, result) => {
//     if (err) {
//       console.error('Error deleting ads in the database:', err.message);
//       return res.status(500).send('Database delete failed');
//     }
//     console.log(`Ads deleted for subscription: ${stripeSubscriptionId}`);
//   });
// }


  
//   res.json({ received: true });

// })


// app.use(bodyParser.json()); 
// app.use(cors())
// app.use(express.json());
// app.get('/', (req, res) => {
//   res.send('Hello from the backend!');
// });

// Middleware för att verifiera JWT


//   const cron = require('node-cron');

//   // Schemalagd uppgift som körs varje dag vid midnatt
//   cron.schedule('0 0 * * *', () => {
//     console.log('Running daily job to update old ads');
//     const role = 'old';
    
//     // Corrected SQL query to update Role field
//     const updateOldAdsSql = `
//       UPDATE Annons 
//       SET Role = ? 
//       WHERE Date < (CURDATE() - INTERVAL 1 DAY)
//     `;
    
//     db.query(updateOldAdsSql, [role], (err, result) => {
//       if (err) {
//         console.error('Error updating old ads:', err.message);
//       } else {
//         console.log('Old ads updated successfully:', result.affectedRows);
//       }
//     });
//   });


//   app.get('/ads', (req, res) => {
//     const sql = 'SELECT * FROM Annons WHERE ROLE = "new"';
//     db.query(sql, (error, results) => {
//       if (error) {
//         return res.status(500).send('Error retrieving ads');
//       }
//       res.json(results);
//     });
//   });

//   app.get('/ads/:id', (req, res) => {
//     const adId = req.params.id;
  
//     // SQL query to increment the AntalVisitors count
//     const incrementVisitorsSql = 'UPDATE Annons SET AntalVisitors = AntalVisitors + 1 WHERE _id = ?';
//     db.query(incrementVisitorsSql, [adId], (error, result) => {
//       if (error) {
//         return res.status(500).send('Error updating visitor count');
//       }
  
//       // SQL query to retrieve the ad details
//       const getAdSql = 'SELECT * FROM Annons WHERE _id = ?';
//       db.query(getAdSql, [adId], (error, result) => {
//         if (error) {
//           return res.status(500).send('Error retrieving ad details');
//         }
//         res.json(result[0]);
//       });
//     });
//   });

//   app.get('/my-ads', (req, res) => {
//     const userEmail = req.query.email; // Hämta användarens email från query-parametrar
  
//     if (!userEmail) {
//       return res.status(400).send('Email is required');
//     }
  
//     // Antag att Person_id är kopplat till användarens e-post i tabellen Person
//     const sql = `
//       SELECT * FROM Annons 
// WHERE Person_id IN (SELECT Email FROM Person WHERE Email = ?)
//     `;
  
//     db.query(sql, [userEmail], (err, results) => {
//       if (err) {
//         console.error('Error fetching ads:', err.message);
//         return res.status(500).send('Database query failed');
//       }
  
//       if (results.length > 0) {
//         res.json(results); // Returnera alla annonser som tillhör användaren
//       } else {
//         res.status(404).send('No ads found for this user');
//       }
//     });
//   });

  // app.post('/create-checkout-session', async (req, res) => {
  //   const { priceId, email } = req.body;  // Pass the price ID of the selected subscription from the frontend
  //   console.log(priceId)
  //   const sql = 'UPDATE Person SET stripe_price_id = ? WHERE Email = ?';
  // db.query(sql, [priceId, email], (err, result) => {
  //   if (err) {
  //     console.error('Error updating user plan:', err.message);
  //     return res.status(500).send(`Error updating user plan: ${err.message}`);
  //   }
  //   console.log('User plan updated successfully');
  // });

  //   const customer = await stripe.customers.create({
  //     email: email, // Use the user's email from the request
  //   });

  //   try {
  //     const session = await stripe.checkout.sessions.create({
  //       payment_method_types: ['card'],
  //       mode: 'subscription',
  //       customer: customer.id,
  //       line_items: [
  //         {
  //           price: priceId,  // Stripe price ID for the product (e.g., Bronze, Silver, Gold)
  //           quantity: 1,
  //         },
  //       ],
  //       success_url: 'http://localhost:5173/success',  // Redirect after success
  //       cancel_url: 'http://localhost:5000/cancel',  // Redirect if payment is canceled
  //     });
      
  //     res.json({ id: session.id });  // Send the session ID to the frontend
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // });

  // app.post('/save-user', (req, res) => {
  //   const { email } = req.body;
  //   console.log('Received data:', email);
  //       Lägg till ny användare i databasen
  //       const insertUserSql = 'INSERT INTO Person (Email) VALUES (?)';
  //       console.log('Inserting into database:', email);
  //       db.query(insertUserSql, [email], (err, result) => {
  //         if (err) {
  //           console.error('Error saving user:', err.message);
  //           return res.status(500).send(`Error saving user: ${err.message}`);
  //         }
  //         res.status(200).send('User saved successfully');
  //       });
  //     }
  //   )

// // Route för att få användarens roll baserat på deras email
// app.get('/user-role', (req, res) => {
//   const email = req.query.userEmail; // Hämta e-post från query-parametern

//   if (!email) {
//     return res.status(400).send('Email is required');
//   }

//   const sql = 'SELECT Role, Email FROM Person WHERE Email = ?';
//   db.query(sql, [email], (err, results) => {
//     if (err) {
//       console.error('Error fetching user role:', err.message);
//       return res.status(500).send('Database query failed');
//     }

//     if (results.length > 0) {
//       res.json({ role: results[0].Role, email: results[0].Email });
//     } else {
//       res.status(404).send('User not found');
//     }
//   });
// });


// app.get('/user-plan', (req, res) => {
//   const {email} = req.query;

//   if (!email) {
//     return res.status(400).send('Email is required');
//   }

//   const sql = 'SELECT stripe_price_id FROM Person WHERE Email = ?';
//   db.query(sql, [email], (err, results) => {
//     if (err) {
//       console.error('Error fetching user plan:', err.message);
//       return res.status(500).send('Database query failed');
//     }

//     if (results.length > 0) {
//       const priceId = results[0].stripe_price_id;
//       res.json({ plan: priceId });
//     } else {
//       res.status(404).send('User not found');
//     }
//   });
// });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Se till att denna sökväg är korrekt
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Skapar ett unikt filnamn
//   }
// });


// const upload = multer({ storage: storage });
// // Route för att spara ny annons
// app.post('/new-ad', upload.single('Bild'), (req, res) => {
  // const { Rubrik, Date, Pris, Beskrivning, Gender, Age, Level, Stad, AntalVisitors, Person_id, extraLink, youtubeLink  } = req.body;
  // const Bild = req.file ? req.file.filename : null;
  // const Role = 'new'
  // const sql = 'INSERT INTO Annons (Rubrik, Date, Pris, Beskrivning, Gender, Age, Level, Stad, AntalVisitors, Person_id, Bild, Link, Role, YoutubeLink) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  // const values = [Rubrik, Date, Pris, Beskrivning, Gender, Age, Level, Stad, AntalVisitors, Person_id, Bild, extraLink, Role, youtubeLink];

  // db.query(sql, values, (err, result) => {
  //   if (err) {
  //     console.error('Error saving ad:', err);
  //     return res.status(500).send('Error saving ad');
  //   }
  //   res.status(200).send('Ad saved successfully');
  // });
// });
// app.use('/uploads', express.static('uploads'));



// app.get('/ad-count', (req, res) => {
//   const personId = req.query.personId; // Hämta personId från query-parametern
  
//   if (!personId) {
//     return res.status(400).send('Person ID is required');
//   }

//   const sql = 'SELECT COUNT(*) AS adCount FROM Annons WHERE Person_id = ?';
//   db.query(sql, [personId], (err, results) => {
//     if (err) {
//       console.error('Error fetching ad count:', err.message);
//       return res.status(500).send('Database query failed');
//     }

//     res.json({ adCount: results[0].adCount });
//   });
// });

// app.post('/cancel-subscription', async (req, res) => {
//   const { stripeSubscriptionId } = req.body;

//   try {
//     // Avbryt prenumerationen hos Stripe vid slutet av perioden
//     const subscription = await stripe.subscriptions.update(stripeSubscriptionId, {
//       cancel_at_period_end: true, // Sätt till true för att avsluta vid periodens slut
//     });

//     res.json({ message: 'Subscription cancellation scheduled successfully' });
//   } catch (error) {
//     console.error('Error cancelling subscription:', error);
//     res.status(500).send('Error cancelling subscription');
//   }
// });





app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});