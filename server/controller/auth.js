require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.adminAuth = (req, res, next) => {
    if(typeof req.headers.authorization !== "undefined") {
        let token = req.headers.authorization.split(" ")[1]; 
        let privateKey = process.env.PASS_KEY; 

        jwt.verify(token, privateKey, { algorithm : 'HS256'}, (err, decoded) => {
            console.log(decoded);
            if(err || decoded["email"] !== "admin") {
                res.status(500).json({ error: "Not Authorized as Admin"})
                return;
            }

            console.log("auth done"); 
            return next(); 
        })

    }else {
        res.status(500).json({ error: "Not Authorized "})
    }
}

exports.userAuth = (req, res, next) => {
    
    console.log("header", req.headers.authorization);
    if(typeof req.headers.authorization !== "undefined") {
        let token = req.headers.authorization.split(" ")[1]; 
        let privateKey = process.env.PASS_KEY; 
        console.log(token);

        jwt.verify(token, privateKey, { algorithm : 'HS256'}, (err, decoded) => {
            if(err) {
                res.status(500).json({ error: "Not Authorized "})
                return;
            }

            console.log(decoded); 
            req.body.email= decoded["email"];

            return next(); 
        })

    }else {
        res.status(500).json({ error: "Not Authorized"})
    }

}