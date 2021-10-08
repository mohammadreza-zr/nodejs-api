const mongoose = require('mongoose');
var moment = require('jalali-moment');

const schemaCustomer = new mongoose.Schema({
  name: { type: String, required: true },
  tags: { type: String },
  number: Number,
  publishDate: { type: String, default: moment().locale('fa').format('YYYY/M/D h:m:s') },
  completed: { type: Boolean, default: false },
  wallet: Number,
});
const CustomerModel = mongoose.model('customer', schemaCustomer);
module.exports = CustomerModel;
