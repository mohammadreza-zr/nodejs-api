const express = require('express');
const Router = express.Router();
const UserController = require('../http/controller/UserController');
const auth = require('../http/middleware/auth');

Router.post('/api/users/register', UserController.register);

Router.post('/api/users/login', UserController.login);

Router.get('/api/users/sendCode', auth, UserController.sendCode);

Router.post('/api/users/verifyCode', auth, UserController.verifyCode);

module.exports = Router;
