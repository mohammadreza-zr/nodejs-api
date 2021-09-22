const mongoose = require('mongoose');
var moment = require('jalali-moment');

const schemaUser = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  number: { type: Number },
  joinDate: { type: String, default: moment().locale('fa').format('YYYY/M/D h:m:s') },
  password: { type: String, required: true },
  role: { type: String, default: 'member' },
  active: { type: Boolean, default: false },
});
const UserModel = mongoose.model('user', schemaUser);
module.exports = UserModel;
