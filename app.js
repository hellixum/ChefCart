const express = require('express');
const mysql = require('mysql2');
const { sequelize } = require('./server/models'); 

require('dotenv').config();

const app = express(); 

// Parsing middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));

const router = require('./server/routes/router');

app.get('/test', (req, res) =>  res.json({"message": "hello lwdey"}));

app.use('/api', router); 

app.use('*', (req, res) => res.status(404).json({"message" : "Request not found"}));

module.exports = app.listen(process.env.PORT, async () => {
    console.log(`Server started at http://localhost:${process.env.PORT}`)
    await sequelize.authenticate()
    // console.log("Database connected")
}); 