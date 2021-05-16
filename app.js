const express = require('express');
const mysql = require('mysql');

require('dotenv').config();

const app = express(); 

// Parsing middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));

// Connection Pool 
// const pool = require('./server/database/connection')(); 

// Connect to DB
// pool.getConnection((err, connection) => {
//     if(err) throw err; // not connected!
//     console.log('Connected as ID ' + connection.threadId);
//   });
  
const router = require('./server/routes/router');

app.get('/test', (req, res) =>  res.json({"message": "hello lwdey"}));

app.use('/api', router); 

app.use('/', (req, res) => res.status(404).json({"message" : "Request not found"}));

module.exports = app.listen(process.env.PORT, () => console.log(`Server started at http://localhost:${process.env.PORT}`)); 