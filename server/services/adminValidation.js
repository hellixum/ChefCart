const Joi = require('joi'); 

const loginSchema = Joi.object().keys({
    password: Joi.string().required()
}); 

exports.loginValidate = async (data) => {
    return await loginSchema.validate(data); 
}

const getLeadsSchema = Joi.object().keys({
    email: Joi.string().trim().email().required(),
}); 

exports.getLeadsValidate = async (data) => {
    return await getLeadsSchema.validate(data); 
}

const rewardSchema = Joi.object().keys({
    id : Joi.string().required(),
    reward: Joi.number().required()
})

exports.rewardValidate = async (data) => {
    return await rewardSchema.validate(data); 
}

const changeStatusSchema = Joi.object().keys({
    id : Joi.string().required(),
    status: Joi.string().required().valid('New', 'In pipeline', 'Successful', 'Junk')
})

exports.changeStatusValidate = async (data) => {
    return await changeStatusSchema.validate(data); 
}
