const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi)

const validateCustomerCreate = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(30).required(),
        tags: Joi.string().min(1).max(100),
        number: Joi.number(),
        wallet: Joi.number(),
    })
    return schema.validate(data);
}
const validateCustomerUpdate = (data) => {
    const schema = Joi.object({
        id: Joi.objectId().required(),
        name: Joi.string().min(2).max(30).required(),
        tags: Joi.string().min(1).max(100),
        number: Joi.number(),
        wallet: Joi.number(),
    })
    return schema.validate(data);
}

module.exports = {validateCustomerCreate, validateCustomerUpdate}