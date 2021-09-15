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
async function updateCorse(id, name) {
    const course = await CourseModel.findByIdAndUpdate
    (id, {
        $set : {
            name: name
        }
    }, { new: true })
    return course
}

// updateCorseName('61407c547d60f98ad794c37b', 'twitter');

async function deleteCourse(id) {
    return await CourseModel.findByIdAndDelete(id)
}
// deleteCourse('61407c547d60f98ad794c37b');

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

Router.put('/api/corse/:customerId', async (req,res)=> {
    //input validation
    const schema = Joi.object({
        name: Joi.string().min(2).max(10).required(),
        customerId: Joi.required()
    })
    const {error} = schema.validate({...req.body, customerId: req.params.customerId});
    if (error) {
        return res.status(400).send({message: error.message})
    }
    const result = await updateCorse(req.params.customerId, req.body.name);
    result ? res.send(result) : res.send('user not found!');
})

Router.delete('/api/corse/:id', async (req,res)=>{
    const toDelete = await deleteCourse(req.params.id)
    toDelete ? res.status(200).send({delete: true}) : res.status(200).send({delete: false, message: 'user not found!'})
})

module.exports = Router;