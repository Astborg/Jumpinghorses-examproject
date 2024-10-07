const stripe = require('stripe')('sk_test_51P1AxTEGk7e8lKhx7d8y2sc3geuObxXKTbjWemfNXaEJosBs8fj1EmLxuveN4JeWHwM3VrPxLm8mqgc9XTjisWE900uDyo1qYN');
const db = require('../config/db');

exports.createCheckoutSession = async (req, res) => {
    const { priceId, email } = req.body;  // Pass the price ID of the selected subscription from the frontend
    console.log(priceId)
    const sql = 'UPDATE Person SET stripe_price_id = ? WHERE Email = ?';
  db.query(sql, [priceId, email], (err, result) => {
    if (err) {
      console.error('Error updating user plan:', err.message);
      return res.status(500).send(`Error updating user plan: ${err.message}`);
    }
    console.log('User plan updated successfully');
  });

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
};

exports.cancelSubscription = async (req, res) => {
    const { stripeSubscriptionId } = req.body;

  try {
    // Avbryt prenumerationen hos Stripe vid slutet av perioden
    const subscription = await stripe.subscriptions.update(stripeSubscriptionId, {
      cancel_at_period_end: true, // Sätt till true för att avsluta vid periodens slut
    });

    res.json({ message: 'Subscription cancellation scheduled successfully' });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).send('Error cancelling subscription');
  }
}