const mongoose = require('mongoose');
const schemaCustomer = new mongoose.Schema({
    name: {type: String, required: true},
    tags: [String],
    teacher: String,
    publishDate: {type: Date, default: Date.now},
    completed: {type: Boolean, default: false},
    price: Number
})
const CustomerModel = mongoose.model('customer', schemaCustomer);
module.exports = CustomerModel