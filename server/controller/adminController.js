require('dotenv').config();  
const jwt = require('jsonwebtoken');
const Joi = require('joi'); 
const validation = require('../services/adminValidation'); 

// Connection pool
const pool = require('../database/connection')(); 

let leads_table = process.env.LEADS_TABLE; 
let refree_table = process.env.REFREE_TABLE; 
let DB_name = process.env.DB_NAME;

exports.login = async (req, res) => {

    const result = await validation.loginValidate(req.body); 
    if(result.error){
        const error = result.error.details[0].message; 
        res.status(400).json({"message": error });
        return;
    }


    const {password} = req.body; 
    let privateKey = process.env.PASS_KEY;  

    pool.getConnection((err, connection) => {
        if(err) throw err; // not connected!!!!
        // console.log('Connected as ID ' + connection.threadId); 

        // console.log(password);
        if(password === process.env.ADMIN_PASS) {
            let token = jwt.sign({'email': "admin"}, privateKey, { algorithm : 'HS256'}); 
            res.status(200).json({"jwt" : token , "message" : "Admin Logged in Successfully"});
        }else{
            res.status(400).json({"message": err}); 
        }
    })
}


/// Sends all the refree's data to ADMIN; 
exports.refreeData = (req, res) => {
    // console.log("admin asked for refree data"); 

    pool.getConnection((err, connection) => {
        if(err) throw err; // not connected!!!!
        // console.log('Connected as ID ' + connection.threadId); 

        const qry = `SELECT * FROM ${refree_table}`; 
        connection.query(qry, (err, rows) => {
            // When done with connection, release it
            connection.release();

            if(!err) {
                // console.log(rows);
                let data = rows.map((user) => {
                    return {
                        first_name: user.first_name, 
                        last_name: user.last_name, 
                        email: user.email, 
                        phone: user.phone
                    }
                });

                res.status(200).json(data); 
            }else{
                res.status(400).json({"message": err}); 
            }
        })
    })

}

exports.getLeads = async (req, res) => {
    const result = await validation.getLeadsValidate(req.body); 
    if(result.error){
        const error = result.error.details[0].message; 
        res.status(400).json({"message": error });
        return;
    }

    const {email} = req.body; 

    pool.getConnection((err, connection) => {
        if(err) throw err; // not connected!!!!
        // console.log('Connected as ID ' + connection.threadId); 

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

exports.reward = async (req, res) => {
    const result = await validation.rewardValidate(req.body); 
    if(result.error){
        const error = result.error.details[0].message; 
        res.status(400).json({"message": error });
        return;
    }

    const {id , reward} = req.body; 

    pool.getConnection((err, connection) => {
        if(err) throw err; // not connected!!!!
        // console.log('Connected as ID ' + connection.threadId); 

        const qry = `UPDATE ${leads_table} SET reward = ? WHERE ${leads_table}.id = ?`; 
        connection.query(qry, [reward, id], (err, rows) => {
            // When done with connection, release it
            connection.release(); 
            if(!err) {
                res.status(200).json({"message" : `lead id: ${id} is given reward ${reward}`}); 
            }else{
                res.status(400).json({"message" : err}); 
            }
        })
    })

}

exports.changeStatus = async (req, res) => {

    const result = await validation.changeStatusValidate(req.body); 
    if(result.error){
        const error = result.error.details[0].message; 
        res.status(400).json({"message": error });
        return;
    }

    const {id , status} = req.body; 

    pool.getConnection((err, connection) => {
        if(err) throw err; // not connected!!!!
        // console.log('Connected as ID ' + connection.threadId); 

        const qry = `UPDATE ${leads_table} SET status = ? WHERE ${leads_table}.id = ?`; 
        connection.query(qry, [status, id], (err, rows) => {
            // When done with connection, release it
            connection.release(); 
            if(!err) {
                res.status(200).json({"message": `lead id: ${id} is given status ${status}`}); 
            }else{
                res.status(400).json({"message": err}); 
            }
        })
    })
}

exports.createTable = (req, res) => {
    
    const qry1 = 'CREATE TABLE `'+DB_name+'`.`'+leads_table+'` ( `id` INT NOT NULL AUTO_INCREMENT , `first_name` VARCHAR(45) NOT NULL , `last_name` VARCHAR(45) NOT NULL , `phone` VARCHAR(45) NOT NULL , `address` TEXT NOT NULL , `ref_email` VARCHAR(45) NOT NULL , `reward` INT NOT NULL , `status` VARCHAR(45) NOT NULL , `dateCreated` DATE NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;'; 
    const qry2 = 'CREATE TABLE `'+DB_name+'`.`'+refree_table+'` ( `first_name` VARCHAR(45) NOT NULL , `last_name` VARCHAR(45) NOT NULL , `email` VARCHAR(45) NOT NULL , `phone` VARCHAR(45) NOT NULL , `password` TEXT NOT NULL , PRIMARY KEY (`email`)) ENGINE = InnoDB;';
        
    pool.query(qry1, (err, result) => {
        if(err){
            res.status(400).json({"message": err}); 
            return; 
        } 

        pool.query(qry2, (err, result) => {
            if(err){
                res.status(400).json({"message": err}); 
                return; 
            } 
            // console.log(result); 
            res.status(200).json({"message": `Both table Created`}); 
        })
    })

}
