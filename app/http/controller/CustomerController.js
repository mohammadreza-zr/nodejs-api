const customerModel = require('../../model/customerModel');
const {
  validateCustomerCreate,
  validateCustomerUpdate,
} = require('../validators/customerValidator');
const mongoose = require('mongoose');

async function getCustomers(pageNumber) {
  const pageSize = 10;
  const loadCustomerList = await customerModel
    .find()
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);
  return loadCustomerList;
}
async function updateCustomer(id, body) {
  const { name, tags, number, wallet } = body;
  const customer = await customerModel.findByIdAndUpdate(
    id,
    {
      $set: {
        name: name,
        tags: tags,
        number: number,
        wallet: wallet,
      },
    },
    { new: true },
  );
  return customer;
}
module.exports = new (class CustomerController {
  async customerList(req, res) {
    let pageNumber = req.query['page'] ? req.query['page'] : 1;
    let customerList = await getCustomers(pageNumber);
    const customerListCount = await customerModel.find().count();
    res.status(200).send({ customerList, customerListCount });
  }
  async getCustomerById(req, res) {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).send('id is not valid!');
    const Customer = await customerModel.findById(req.params.id);
    if (Customer) res.send(Customer);
    else res.status(404).send('not fond!');
  }
  async newCustomer(req, res) {
    const { error } = validateCustomerCreate(req.body);
    if (error) return res.status(400).send({ message: error.message });
    let newCustomer = new customerModel({
      name: req.body.name,
      tags: req.body.tags,
      number: req.body.number,
      completed: req.body.completed,
      wallet: req.body.wallet,
    });
    await newCustomer.save().then(async () => {
      let pageNumber = req.query['page'] ? req.query['page'] : 1;
      let CustomerList = await getCustomers(pageNumber);
      const CustomerListCount = await customerModel.find().count();
      res.status(200).send({ CustomerList, CustomerListCount });
    });
  }
  async editCustomer(req, res) {
    const { error } = validateCustomerUpdate({ ...req.body, id: req.params.customerId });
    if (error) return res.status(400).send({ message: error.message });
    const result = await updateCustomer(req.params.customerId, req.body);
    result ? res.send(result) : res.send('user not found!');
  }
  async deleteCustomer(req, res) {
    const toDelete = await customerModel.findByIdAndDelete(req.params.id);
    const CustomerListCount = await customerModel.find().count();
    toDelete
      ? res.status(200).send({ delete: true, CustomerListCount })
      : res.status(200).send({ delete: false, message: 'user not found!' });
  }
})();
