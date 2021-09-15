const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi)

const validateCustomerCreate = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(10).required(),
        tags: Joi.array().min(1).max(30),
        teacher: Joi.string().min(2).max(10),
        price: Joi.number(),
    })
    return schema.validate(data);
}
const validateCustomerUpdate = (data) => {
    const schema = Joi.object({
        id: Joi.objectId().required(),
        name: Joi.string().min(2).max(10).required(),
        tags: Joi.array().min(1).max(30),
        teacher: Joi.string().min(2).max(10),
        price: Joi.number(),
    })
    return schema.validate(data);
}

module.exports = {validateCustomerCreate, validateCustomerUpdate}