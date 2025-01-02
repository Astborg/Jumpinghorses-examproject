const express = require('express');
const { handleWebhook } = require('../controllers/webhookController');
const bodyParser = require('body-parser');

const router = express.Router();

router.post('/webhook', bodyParser.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;