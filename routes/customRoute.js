const express = require('express');
const Router= express.Router();
const Joi = require('joi');
const CourseModel = require('../database/database');
let courseList = [];

async function getCourses(pageNumber) {
    const pageSize = 10;
    const loadCourseList = await CourseModel
    .find()
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    courseList = loadCourseList
}

Router.get('/api/corse/', async (req,res)=>{
    try{
        let pageNumber = req.query['page'] ? req.query['page'] : 1;
        await getCourses(pageNumber);
        const courseListCount = await CourseModel.find().count()
        res.status(200).send({courseList, courseListCount});
    }
    catch{
        console.log('error',req.query);
    }
})

Router.get('/api/corse/:id', (req,res)=>{
    const customer = courseList.find(element => element.teacher == req.params.id);
    if (customer) res.send(customer)
    else res.status(404).send('not fond!')
})

Router.post('/api/corse', (req, res)=>{
    //input validation
    const schema = Joi.object({
        name: Joi.string().min(2).max(10).required()
    })
    const {error} = schema.validate(req.body);
    if (error) {
        return res.status(400).send({message: error.message})
    }
    const newCourse = new CourseModel({
        name: req.body.name,
        tags: ['node js', 'js'],
        teacher: 'محمدرضا',
        completed: false
    })
    newCourse.save().then(async ()=>{
        let pageNumber = req.query['page'] ? req.query['page'] : 1;
        await getCourses(pageNumber);
        const courseListCount = await CourseModel.find().count()
        res.status(200).send({courseList, courseListCount});
    }).catch(err=>console.log(err))
})

Router.put('/api/corse/:customerId', (req,res)=> {
    //input validation
    const schema = Joi.object({
        name: Joi.string().min(2).max(10).required(),
        customerId: Joi.number().required()
    })
    const {error} = schema.validate({...req.body, customerId: req.params.customerId});
    if (error) {
        return res.status(400).send({message: error.message})
    }
    const index = customers.findIndex(item => item.id == req.params.customerId);
    if (index === -1) return res.status(404).send({message: "مشتری مورد نظر یافت نشد"})

    customers[index].name =  req.body.name;
    res.send(customers[index]);
})

Router.delete('/api/corse/:customerId', (req,res)=>{
    const index = customers.findIndex(item => item.id == req.params.customerId);
    if (index === -1) return res.status(404).send({message: "مشتری مورد نظر یافت نشد"})
    customers = [...customers.slice(0, index), ...customers.slice(index + 1)];
    res.status(200).send();
})

module.exports = Router;