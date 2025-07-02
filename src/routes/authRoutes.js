const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Importando o controller

// Rota para login
router.post('/login', authController.login);

// Rota para registro de novo usuário
router.post('/register', authController.register);

module.exports = router;
