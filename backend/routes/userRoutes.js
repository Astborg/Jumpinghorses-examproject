const express = require('express');
const { getUserRole, saveUser, userPlan } = require('../controllers/userController');

const router = express.Router();

router.get('/user-role', getUserRole);
router.post('/save-user', saveUser);
router.get('/user-plan', userPlan);

module.exports = router;