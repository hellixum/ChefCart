const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcrypt'); 
const Joi = require('joi'); 
const validation = require('../services/refValidation'); 

const { refrees, leads } = require('../models'); 

require('dotenv').config();

// Login the refrees 
exports.login = async (req, res) => {

    // Validating the refrees data 
    const result = await validation.loginValidate(req.body); 
    
    if(result.error){
        const error = result.error.details[0].message; 
        res.status(400).json({"message": error });
        return;
    }


    let privateKey = process.env.PASS_KEY;
    // console.log(req.body);
    const {email, password} = req.body; 

    try {
        const user = await refrees.findOne({where: { email : email}}); 
        if(!user){
            res.status(500).json({"message" : "User not Found"});
            return;
        }


        // console.log('/n /n /n /n /n User is below')
        // console.log(user.dataValues); 
        // res.send(user); 
        // return; 
        const real_pass = user.dataValues.password; 
        const match = await bcrypt.compare(password, real_pass); 
                

        if(match) {
            let token = jwt.sign({'email': user.dataValues.email}, privateKey, { algorithm : 'HS256'}); 
            res.status(200).json({"jwt" : token , "message" : "Logged in Successfully"});
        }else{
            res.status(400).json({"message": "Password not matched"});
        }

    } catch(err) {
        res.status(500).json({"message" : err}); 
        return;
    }
    
}

exports.signup = async (req, res) => {

    const result = await validation.signupValidate(req.body); 

    if(result.error){
        const error = result.error.details[0].message; 
        res.status(400).json({"message": error });
        return;
    }

    // console.log(req.body); 
    let { first_name, last_name, email, phone, password } = req.body;
    // console.log(req.body);


    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt); 

    try {
        const user = await refrees.create({
            first_name, 
            last_name, 
            email, 
            phone, 
            password: hashedPassword
        }); 

        res.status(200).json({'message': `User ${first_name} ${last_name} added successfully`})
    }catch(err) {
        // console.log(err); 
        res.status(500).json({'message': "email already registered"}); 
    }

}

exports.getLeads = async (req, res) => {
    // send all the leads referred by the refrees
    const {email} = req.body; 
    console.log(email); 

    try {
        const user = await leads.findAll({attributes: ['first_name', 'last_name', 'phone', 'address'], where: { ref_email : email}}); 

        if(!user){
            res.status(500).json({"message" : "User not Found"});
            return;
        }
        res.status(200).send(user);

    } catch(err) {
        res.status(500).json({"message" : err}); 
    }
    
}


// Add new lead to the table
exports.addLead = async (req, res) => {

    const result = await validation.addLeadValidate(req.body); 
    
    if(result.error){
        const error = result.error.details[0].message; 
        res.status(400).json({"message": error });
        return;
    }

    const { email, first_name, last_name, phone, address } = req.body;
    const status = "New", reward = 0; 

    const ref_email = email;


    try {
        const user = await leads.create({
            first_name, 
            last_name, 
            phone, 
            address,  
            ref_email,
            status, 
            reward
        }); 

        res.status(200).send({message: `Lead added successfully by ref_email ${email}`});
    }catch(err) {
        // console.log(err); 
        res.status(400).json({"message": err});
    }

}

exports.leadsBetween = async (req, res) => {

    const result = await validation.leadsBetweenValidate(req.bosy); 

    if(result.error){
        const error = result.error.details[0].message; 
        res.status(400).json({"message": error });
        return;
    }

    let { email, date_from, date_to } = req.body; 
    date_from += " 00:00:00"; 
    date_to += " 00:00:00"; 

    console.log(date_from); 
    console.log(date_to);


    const lead = await leads.findAll({
        attributes: ['first_name', 'last_name', 'phone', 'address'],
        where: {
            ref_email: email, 
            createdAt : {
                "$between": [date_from, date_to]
            }
        }
    })

    res.send(lead); 

    // if(!err) {
    //     console.log(rows);
    //     res.status(200).send(rows); 
    // }else{
    //     res.status(400).send({message: err}); 
    // }


}