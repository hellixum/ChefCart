const pool = require('../database/connection')();

const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcrypt'); 
const Joi = require('joi'); 
const validation = require('../services/refValidation');  
const { ValidationError } = require('joi');

require('dotenv').config();

let leads_table = process.env.LEADS_TABLE; 
let refree_table = process.env.REFREE_TABLE; 

// Login the Refree 
exports.login = async (req, res) => {

    // Validating the Refree data 
    const result = await validation.loginValidate(req.body); 
    
    if(result.error){
        const error = result.error.details[0].message; 
        res.status(400).json({"message": error });
        return;
    }


    let privateKey = process.env.PASS_KEY;
    // console.log(req.body);
    const {email, password} = req.body; 

    pool.getConnection((err, connection) => {
        if(err) throw err; // not connected!!!!
        // console.log('Connected as ID ' + connection.threadId);  

        const qry = `SELECT * FROM ${refree_table} WHERE email LIKE ?`; 
        connection.query(qry, [email], async (err, rows) => {
            // When done with connection, release it
            connection.release(); 
            // console.log(rows); 

            if(err){
                res.status(400).json({"message" : err}); 
                return; 
            }

            if(rows.length === 0){
                res.status(400).json({"message" : "User not Found"});
                return;
            }

            const real_pass = rows[0].password; 
            const match = await bcrypt.compare(password, real_pass); 
                 

            if(match) {
                let token = jwt.sign({'email': rows[0].email}, privateKey, { algorithm : 'HS256'}); 
                res.status(200).json({"jwt" : token , "message" : "Logged in Successfully"});
            }else{
                res.status(400).json({"message": "Password not matched"});
            }
        })
    })
    
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


    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt); 

    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected!
        // console.log('Connected as ID ' + connection.threadId);

        let qry = `INSERT INTO ${refree_table} SET first_name = ?, last_name = ?, email = ?, phone = ?, password = ?`; 
        connection.query(qry, [first_name, last_name, email, phone, hashedPassword], (err, rows) => {
        // When done with the connection, release it
            connection.release();
            if (!err) {
                res.status(200).json({'message': `User ${first_name} ${last_name} added successfully`})
            } else {
                res.status(400).json({'message': "email already registered"}); 
            }
        });
    });
    

}

exports.getLeads = (req, res) => {
    // send all the leads referred by the refree
    pool.getConnection((err, connection) => {
        if(err) throw err; // not connected!!!!
        // console.log('Connected as ID ' + connection.threadId); 

        // console.log(req.body);
        const {email} = req.body; 

        const qry = `SELECT * FROM ${leads_table} WHERE ref_email LIKE '${email}'`; 
        connection.query(qry, (err, rows) => {
            // When done with connection, release it
            connection.release(); 
            if(!err) {
                // console.log(rows);
                res.status(200).send(rows); 
            }else{
                res.status(400).send({message: err}); 
            }
        })
    })
    
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

    const date = new Date(); 
    const dateCreated = date.toISOString().slice(0,10);

    const ref_email = email;
    const qry = `INSERT INTO ${leads_table} SET ?`
    let query = pool.query(qry, {first_name, last_name, phone, address, ref_email, reward, status, dateCreated}, (err, result) => {
        if(err){
            res.status(400).json({"message": err}); 
            return; 
        } 
        // console.log(result); 
        res.status(200).send({message: `Lead added successfully by ref_email ${email}`});
    })

}

exports.leadsBetween = async (req, res) => {

    const result = await validation.leadsBetweenValidate(req.bosy); 

    if(result.error){
        const error = result.error.details[0].message; 
        res.status(400).json({"message": error });
        return;
    }

    // const { email, date_from, date_to } = req.body; 
    // let qry = `SELECT * FROM ${leads_table} WHERE ref_email LIKE '${email}' AND dateCreated BETWEEN ${date_from} AND ${date_to}`
    // console.log(qry);

    // pool.query(qry,(err, result) => {
    //     if(err){
    //         res.status(400).json({"message": err}); 
    //         return ;
    //     }

    //     console.log(result);
    //     res.status(200).json(result);
    // })


    pool.getConnection((err, connection) => {
        if(err) throw err; // not connected!!!!
        // console.log('Connected as ID ' + connection.threadId); 

        console.log(req.body);
        const { email, date_from, date_to } = req.body; 
        let qry = `SELECT * FROM ${leads_table} WHERE ref_email = ? AND dateCreated BETWEEN ? AND ?` 
        // let qr = "SELECT * FROM `lead_table` WHERE `ref_email` LIKE 'sanu@gmail.com' AND `dateCreated` BETWEEN '2021-05-16' AND '2021-05-20'"
        console.log(qry);
        connection.query(qry,[email, date_from, date_to] ,(err, rows) => {
            // When done with connection, release it
            connection.release(); 
            if(!err) {
                console.log(rows);
                res.status(200).send(rows); 
            }else{
                res.status(400).send({message: err}); 
            }
        })
    })


}