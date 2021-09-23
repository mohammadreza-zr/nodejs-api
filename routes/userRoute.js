const express = require('express');
const Router = express.Router();
const UserModel = require('../model/UserModel');
const {
  validateUserRegister,
  validateUserLogin,
} = require('../validators/userValidator');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const MelipayamakApi = require('melipayamak');
const auth = require('../middleware/auth');
const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 2 * 60, checkperiod: 60 });

Router.post('/api/users/register', async (req, res) => {
  const { error } = validateUserRegister(req.body);
  if (error) return res.status(400).send({ message: error.message, status: 'failed' });
  let user = await UserModel.findOne({ email: req.body.email });
  if (user)
    return res
      .status(400)
      .send({ message: 'this user already joined!', status: 'failed' });
  const salt = await bcrypt.genSalt(10);
  user = new UserModel({
    name: req.body.name,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, salt),
  });
  const data = {
    _id: user._id,
    name: user.name,
    role: user.role,
  };
  const token = jwt.sign(data, config.get('jwtPrivetKey'));
  await user
    .save()
    .then(async () => {
      res.send({
        user: _.pick(user, ['name', 'email', 'role']),
        'x-auth-token': token,
        message: 'user created...',
        status: 'success',
      });
    })
    .catch((err) => console.log(err));
});

Router.post('/api/users/login', async (req, res) => {
  const { error } = validateUserLogin(req.body);
  if (error) return res.status(400).send({ message: error.message, status: 'failed' });
  let user = await UserModel.findOne({ email: req.body.email });
  if (!user)
    return res
      .status(400)
      .send({ message: 'user or password not match!', status: 'failed' });
  const result = await bcrypt.compare(req.body.password, user.password);
  if (!result) {
    return res
      .status(400)
      .send({ message: 'user or password not match!', status: 'failed' });
  }
  const data = {
    _id: user._id,
    name: user.name,
    role: user.role,
  };
  const token = jwt.sign(data, config.get('jwtPrivetKey'));
  res.send({
    status: 'success',
    'x-auth-token': token,
    message: 'logged in...',
    user: _.pick(user, ['name', 'email', 'role']),
  });
});

Router.get('/api/users/sendCode', auth, async (req, res) => {
  const id = req.user._id;
  const user = await UserModel.findById(id);
  if (!user)
    return res.status(404).send({ message: 'user not fond !!!!', status: 'failed' });
  const code = Math.floor(Math.random() * 100000);
  myCache.set(id, code);
  const username = config.get('usernameSMS');
  const password = config.get('passwordSMS');
  const api = new MelipayamakApi(username, password);
  const sms = api.sms();
  const to = user.number;
  const from = config.get('SMSNumber');
  const text = `your code is: \n ${code}`;
  await sms
    .send(to, from, text)
    .then(async (res) => {
      //
    })
    .catch((err) => {
      console.log(err);
      res.send({ status: 'failed' });
    });
  res.send({ status: 'success' });
});
Router.post('/api/users/verifyCode', auth, async (req, res) => {
  if (!req.body.code)
    return res.status(400).send({ message: 'please send code.', status: 'failed' });
  const id = req.user._id;
  const code = req.body.code;
  const lastCode = myCache.get(id);
  if (code == lastCode) {
    const user = await UserModel.findById(id);
    user.active = true;
    await user.save();
    res.send({ status: 'success' });
  } else res.status(400).send({ status: 'failed' });
});

module.exports = Router;
