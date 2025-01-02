require('dotenv').config();
const express = require('express');
const cors = require('cors');
const adsRoutes = require('./routes/adsRoutes');
const userRoutes = require('./routes/userRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const { runDailyJob } = require('./utils/cronJobs');
const { expressjwt: jwt } = require('express-jwt'); 
const jwksRsa = require('jwks-rsa');
const axios = require('axios');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors({
  origin: 'https://jumpinghorses-examproject-alva.vercel.app',
}));

app.use('/api', webhookRoutes);         // Stripe webhook routes for handling subscription events

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});