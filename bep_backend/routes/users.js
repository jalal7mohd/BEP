const express = require('express');
const { getProfile, resetPassword } = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();


router.get('/profile', verifyToken, getProfile);

router.put('/reset-password', verifyToken, resetPassword);

module.exports = router;