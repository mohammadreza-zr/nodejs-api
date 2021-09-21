const express = require('express');
const Router= express.Router();
const UserModel = require('../model/UserModel');
const { validateUserRegister, validateUserLogin } = require('../validators/userValidator');
const _ = require('lodash')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const MelipayamakApi = require('melipayamak');
const auth = require('../middleware/auth');
const NodeCache = require('node-cache');
const myCache = new NodeCache({stdTTL:2*60*60, checkperiod: 5*60})

Router.post('/api/users/register', async (req, res)=>{
    const {error} = validateUserRegister(req.body)
    if (error) return res.status(400).send({message: error.message})
    let user = await UserModel.findOne({email: req.body.email})
    if (user) return res.status(400).send('this user already joined!');
    const salt = await bcrypt.genSalt(10)
    user = new UserModel({
        name: req.body.name,
        email: req.body.email,
        number: req.body.number,
        password: await bcrypt.hash(req.body.password,salt),
        role: 'admin'
    })
    const data = {
        _id: user._id,
        name: user.name,
        role: user.role
    }
    
    const token = jwt.sign(data, config.get('jwtPrivetKey'));
    await user.save().then(async ()=>{
        res.header("x-auth-token",token).send(_.pick(user, ["_id","name", "email", "number"]))
    }).catch(err=>console.log(err))
})
Router.post('/api/users/login', async (req, res)=>{
    const {error} = validateUserLogin(req.body)
    if (error) return res.status(400).send({message: error.message})
    let user = await UserModel.findOne({email: req.body.email})
    if (!user) return res.status(400).send('user or password not match!');
    const result = await bcrypt.compare(req.body.password, user.password)
    if (!result) {
        return res.status(400).send('user or password not match!');
    }
    const data = {
        _id: user._id,
        name: user.name,
        role: user.role
    }
    const token = jwt.sign(data, config.get('jwtPrivetKey'));
    res.header("x-auth-token",token).send({success: true})
})

Router.get('/api/users/sendCode',auth, async (req,res)=>{
    const id= req.user._id
    const user = await UserModel.findById(id)
    if(!user) return res.status(404).send('user not fond !!!!')
    const code = Math.floor(Math.random()*100000);
    myCache.set(id, code)
    const username = config.get('usernameSMS');
    const password = config.get('passwordSMS');
    const api = new MelipayamakApi(username,password);
    const sms = api.sms();
    const to = user.number;
    const from = config.get('SMSNumber');
    const text = `your code is: \n ${code}`;
    await sms.send(to,from,text).then(res=>{
        console.log(res)
    }).catch(err=>{
        return res.send('error')
    })
    res.send({success: true})
})
Router.post('/api/users/verifyCode',auth, async (req,res)=>{
    if(!req.body.code) return res.status(400).send('please send code.')
    const id = req.user._id
    const code = req.body.code
    const lastCode = myCache.get(id)
    if (code == lastCode) {
        const user = await UserModel.findById(id)
        user.active = true
        await user.save()
        res.send(true)
    }else res.status(400).send(false)
})

module.exports = Router;