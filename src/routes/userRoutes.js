const express = require('express');
const UserController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/create', authMiddleware, UserController.createUser);
router.get('/all', authMiddleware, UserController.getAllUsers);

module.exports = router;