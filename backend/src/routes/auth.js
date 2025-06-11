const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');
const verifyToken = require('../middleware/authMiddleware');

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.get('/me', verifyToken, authController.getCurrentUser);

router.get('/forgot-password', authController.forgotPassword);

module.exports = router;
