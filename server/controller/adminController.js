require('dotenv').config();  
const jwt = require('jsonwebtoken');
const Joi = require('joi'); 
const validation = require('../services/adminValidation'); 
 
const { refrees, leads } = require('../models'); 

require('dotenv').config();

exports.login = async (req, res) => {

    const result = await validation.loginValidate(req.body); 
    if(result.error){
        const error = result.error.details[0].message; 
        res.status(400).json({"message": error });
        return;
    }


    const {password} = req.body; 
    let privateKey = process.env.PASS_KEY;  

    if(password === process.env.ADMIN_PASS) {
        let token = jwt.sign({'email': "admin"}, privateKey, { algorithm : 'HS256'}); 
        res.status(200).json({"jwt" : token , "message" : "Admin Logged in Successfully"});
    }else{
        res.status(400).json({"message": err}); 
    }
}


/// Sends all the refree's data to ADMIN; 
exports.refreeData = async (req, res) => {
    // console.log("admin asked for refree data"); 

    try {
        const user = await refrees.findAll(); 

        if(!user){
            res.status(500).json({"message" : "User not Found"});
            return;
        }
        res.status(200).send(user);

    } catch(err) {
        res.status(500).json({"message" : err}); 
    }

}

exports.getLeads = async (req, res) => {
    const result = await validation.getLeadsValidate(req.body); 
    if(result.error){
        const error = result.error.details[0].message; 
        res.status(400).json({"message": error });
        return;
    }

    const {email} = req.body; 

    try {
        const user = await leads.findAll( {where: { ref_email : email}}); 

        if(!user){
            res.status(500).json({"message" : "User not Found"});
            return;
        }
        res.status(200).send(user);

    } catch(err) {
        res.status(500).json({"message" : err}); 
    }
}

exports.reward = async (req, res) => {
    const result = await validation.rewardValidate(req.body); 
    if(result.error){
        const error = result.error.details[0].message; 
        res.status(400).json({"message": error });
        return;
    }

    const {id , reward} = req.body; 

    console.log(id, reward); 
    try{
        const user = await leads.update(
            { reward }, 
            {where: { id }}
        )

        res.status(200).json({"message" : `lead id: ${id} is given reward ${reward}`});
    } catch(err) {
        res.status(400).json({"message" : err});
    }

}

exports.changeStatus = async (req, res) => {

    const result = await validation.changeStatusValidate(req.body); 
    if(result.error){
        const error = result.error.details[0].message; 
        res.status(400).json({"message": error });
        return;
    }

    const {id , status} = req.body; 

    try{
        const user = await leads.update(
            { status }, 
            {where: { id }}
        )

        res.status(200).json({"message" : `lead id: ${id} is given status ${status}`});
    } catch(err) {
        res.status(400).json({"message" : err});
    }

}

