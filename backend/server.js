const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
const { expressjwt: jwt } = require('express-jwt'); 
const jwksRsa = require('jwks-rsa');
const stripe = require('stripe')('sk_test_51P1AxTEGk7e8lKhx7d8y2sc3geuObxXKTbjWemfNXaEJosBs8fj1EmLxuveN4JeWHwM3VrPxLm8mqgc9XTjisWE900uDyo1qYN'); 

const app = express();

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

const endpointSecret = 'whsec_9cb9ee33b209dd6195fcf89af36cd06c3f2681f1753b955b85038676c226e49c';
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'] 
  
   // Replace with your webhook signing secret

  let event = req.body;

  try {
    // Construct the event using the raw body and signature
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event type
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('Checkout session completed:', session);
    
  const customerId = session.customer; // Stripe customer ID
  const subscriptionId = session.subscription; // Stripe subscription ID
  const email = session.customer_details.email
  console.log(customerId, subscriptionId)
  const role = 'subscriber';
  // You can use the customer ID to find the user in your database
  // and update their record with the subscription details and role
  const checkUserSql = 'SELECT * FROM Person WHERE Email = ?';
  db.query(checkUserSql, [email], (err, results) => {
    if (err) {
      console.error('Error checking user in the database:', err.message);
      return res.status(500).send('Database query failed');
    }

    if (results.length > 0) {
      // User exists, update the existing record
      const updateUserSql = 'UPDATE Person SET stripe_customer_id = ?, stripe_subscription_id = ?, Role = ? WHERE Email = ?';
      db.query(updateUserSql, [customerId, subscriptionId, role, email], (err, result) => {
        if (err) {
          console.error('Error updating user in the database:', err.message);
          return res.status(500).send('Database update failed');
        }
        console.log('User updated successfully');
      });
    } else {
      // User doesn't exist, insert a new record
      const insertUserSql = 'INSERT INTO Person (Email, stripe_customer_id, stripe_subscription_id, Role) VALUES (?, ?, ?, ?)';
      db.query(insertUserSql, [email, customerId, subscriptionId, role], (err, result) => {
        if (err) {
          console.error('Error saving new user in the database:', err.message);
          return res.status(500).send('Database insert failed');
        }
        console.log('New user added successfully');
      });
    }
  });
}   else if (event.type === 'invoice.payment_failed') {
  // Hantera betalningsfel
  const invoice = event.data.object;
  const email = invoice.customer_email; // Hämta kundens e-post från fakturan

  console.log('Payment failed for invoice:', invoice.id);

  // Uppdatera rollen till 'failure'
  const updateFailureSql = 'UPDATE Person SET Role = ? WHERE Email = ?';
  db.query(updateFailureSql, ['failure', email], (err, result) => {
    if (err) {
      console.error('Error updating user role to failure:', err.message);
      return res.status(500).send('Database update failed');
    }
    console.log('User role updated to failure successfully');
  });
}


  // Return a response to acknowledge receipt of the event
  res.json({ received: true });


// Use body-parser.json() for other routes

// res.status(200).send('Webhook received and processed');
})

app.use(bodyParser.json()); 
app.use(cors())
app.use(express.json());
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
    const sql = `SELECT * FROM Annons WHERE _id = ?;`;
    db.query(sql, [adId], (error, result) => {
      if (error) {
        return res.status(500).send('Error retrieving ad details');
      }
      res.json(result[0]);
    });
  });

  app.post('/create-checkout-session', async (req, res) => {
    const { priceId, email } = req.body;  // Pass the price ID of the selected subscription from the frontend
    console.log(priceId)
    const customer = await stripe.customers.create({
      email: email, // Use the user's email from the request
    });

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        customer: customer.id,
        line_items: [
          {
            price: priceId,  // Stripe price ID for the product (e.g., Bronze, Silver, Gold)
            quantity: 1,
          },
        ],
        success_url: 'http://localhost:5173/success',  // Redirect after success
        cancel_url: 'http://localhost:5000/cancel',  // Redirect if payment is canceled
      });
      
      res.json({ id: session.id });  // Send the session ID to the frontend
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/save-user', (req, res) => {
    const { email } = req.body;
    console.log('Received data:', email);
    
   
    
        // Lägg till ny användare i databasen
        const insertUserSql = 'INSERT INTO Person (Email) VALUES ("test2@example.se")';
        console.log('Inserting into database:', email);
        db.query(insertUserSql, [email], (err, result) => {
          if (err) {
            console.error('Error saving user:', err.message);
            return res.status(500).send(`Error saving user: ${err.message}`);
          }
          res.status(200).send('User saved successfully');
        });
      }
    )
// Route för att få användarens roll baserat på deras email
app.get('/user-role', (req, res) => {
  const email = req.query.userEmail; // Hämta e-post från query-parametern

  if (!email) {
    return res.status(400).send('Email is required');
  }

  const sql = 'SELECT Role FROM Person WHERE Email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Error fetching user role:', err.message);
      return res.status(500).send('Database query failed');
    }

    if (results.length > 0) {
      res.json({ role: results[0].Role });
    } else {
      res.status(404).send('User not found');
    }
  });
});
//    // Webhook endpoint to handle Stripe events
// app.post('/webhook', bodyParser.raw({ type: 'application/json' }), (req, res) => {
//   const sig = req.headers['stripe-signature'];
//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, 'your-webhook-signing-secret');
//   } catch (err) {
//     console.error('Webhook signature verification failed:', err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   if (event.type === 'checkout.session.completed') {
//     const session = event.data.object;
//     const customerId = session.customer; // Stripe customer ID
//     const subscriptionId = session.subscription; // Stripe subscription ID

//     // You can use the customer ID to find the user in your database
//     // and update their record with the subscription details and role
//     const sql = 'UPDATE Person SET stripe_customer_id = ?, stripe_subscription_id = ?, Role = ? WHERE Email = ?';
//     const role = 'subscriber'; // Assign a role based on your logic

//     db.query(sql, [customerId, subscriptionId, role, session.customer_email], (err, result) => {
//       if (err) {
//         console.error('Error updating user in the database:', err.message);
//         return res.status(500).send('Database update failed');
//       }
//       console.log('User updated successfully');
//     });
//   }
 


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});