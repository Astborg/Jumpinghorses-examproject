const stripe = require('stripe')('sk_test_51P1AxTEGk7e8lKhxFG1VaVwACUidkpPuSKGvy8cXtPY4rWFsYgeWLgdCJd8iyzx69pxr4GvRu5NayG1xldJreQhf00xFHcDT3s');
const db = require('../config/db');

const endpointSecret = 'whsec_9cb9ee33b209dd6195fcf89af36cd06c3f2681f1753b955b85038676c226e49c';
// whsec_0C1DbrACvHiCTcFk3VkyjbEibg62Ntl7
exports.handleWebhook = (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

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
} else if (event.type === 'customer.subscription.deleted') {
  const subscription = event.data.object;
  const stripeSubscriptionId = subscription.id;
  const email = subscription.metadata.email; // Om du har sparat e-post som metadata
  
  // Uppdatera rollen i databasen till 'failure'
  const updateUserSql = 'UPDATE Person SET Role = ? WHERE stripe_subscription_id = ?';
  db.query(updateUserSql, ['failure', stripeSubscriptionId], (err, result) => {
    if (err) {
      console.error('Error updating user role in the database:', err.message);
      return res.status(500).send('Database update failed');
    }
    console.log(`User role updated to failure for subscription: ${stripeSubscriptionId}`);
  });
  const deleteAdsSql = 'DELETE FROM Annons WHERE Person_id = (SELECT Email FROM Person WHERE stripe_subscription_id = ?)';
  db.query(deleteAdsSql, [stripeSubscriptionId], (err, result) => {
    if (err) {
      console.error('Error deleting ads in the database:', err.message);
      return res.status(500).send('Database delete failed');
    }
    console.log(`Ads deleted for subscription: ${stripeSubscriptionId}`);
  });
}


  
  res.json({ received: true });

}



