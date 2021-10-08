const express = require('express');
const Router = express.Router();
const CustomerController = require('../http/controller/CustomerController');
const Auth = require('../http/middleware/auth');
const Admin = require('../http/middleware/admin');

Router.get('/api/customer/', CustomerController.customerList);

Router.get('/api/Customer/:id', CustomerController.getCustomerById);

Router.post('/api/Customer', Auth, CustomerController.newCustomer);

Router.put('/api/Customer/:customerId', Auth, CustomerController.editCustomer);

Router.delete('/api/Customer/:id', [Auth, Admin], CustomerController.deleteCustomer);

module.exports = Router;
