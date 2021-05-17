const Joi = require('joi'); 

const loginSchema = Joi.object().keys({
    email: Joi.string().trim().email().required(), 
    password: Joi.string().required()
}); 

exports.loginValidate = async (data) => {
    return await loginSchema.validate(data); 
}

const signupSchema = Joi.object().keys({
    first_name: Joi.string().required(), 
    last_name: Joi.string().required(), 
    email: Joi.string().trim().email().required(),
    phone: Joi.number().required(), 
    password: Joi.string().trim().required()
})

exports.signupValidate = async (data) => {
    return await signupSchema.validate(data); 
}

const addLeadSchema = Joi.object().keys({
    email: Joi.string().trim().email().required(),
    first_name: Joi.string().required(), 
    last_name: Joi.string().required(), 
    phone: Joi.number().required(), 
    address: Joi.string().trim().required()
})

exports.addLeadValidate = async (data) => {
    return await addLeadSchema.validate(data); 
}

const leadsBetweenSchema = Joi.object().keys({
    email: Joi.string().trim().email().required(),
    date_from: Joi.date().iso(), 
    date_to : Joi.date().iso().min(Joi.ref('date_from'))
})

exports.leadsBetweenValidate = async (data) => {
    return await leadsBetweenSchema.validate(data); 
}