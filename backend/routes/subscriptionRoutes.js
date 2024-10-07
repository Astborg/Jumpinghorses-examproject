const express = require('express');
const { createCheckoutSession, cancelSubscription } = require('../controllers/subscriptionController');

const router = express.Router();

router.post('/create-checkout-session', createCheckoutSession);

router.post('/cancel-subscription', cancelSubscription)

module.exports = router;