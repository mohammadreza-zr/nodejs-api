const { names } = require('debug')
const mongoose = require('mongoose')

//database connect
mongoose.connect('mongodb://localhost:27017/corseDb')
.then(()=>{
    console.log('db connected')
})
.catch(err=>{
    console.log('db not connected', err)
})

const schemaCourse = new mongoose.Schema({
    name: {type: String, required: true},
    tags: [String],
    teacher: String,
    publishDate: {type: Date, default: Date.now},
    completed: {type: Boolean, default: false},
})
const CourseModel = mongoose.model('curses', schemaCourse);
module.exports = CourseModel