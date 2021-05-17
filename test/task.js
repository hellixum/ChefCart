const server = require('../app');
const chai = require('chai'); 
const chaiHttp = require('chai-http'); 

var assert = chai.assert;   
var expect = chai.expect;    
var should = chai.should();
chai.use(chaiHttp); 

let leads_table = process.env.LEADS_TABLE; 
let refree_table = process.env.REFREE_TABLE; 
const pool = require('../server/database/connection')(); 


describe('Testing Refree\'s APIs', () => {

    // before("Should delete the entries" , (done) => {
    //     console.log("yaha par to aa gaya hu");

    //     pool.getConnection(`TRUNCATE ${leads_table}`, (err, connection) => {
    //         if(err) throw err; // not connected!!!!
    //         console.log('deleted one'); 

    //         pool.getConnection(`TRUNCATE ${refree_table}`, done)
            
    //     })
    //     console.log("khatram");
    // })

    // it("do something", () => {
    //     console.log("hello"); 
    // })

    // before("Should delete the entries" , (done) => {
    //     const qry = `TRUNCATE ${leads_table}`
    //     pool.query(qry, done)
    // })

    it("Should signup a new user", (done) => {
        chai.request(server)
            .post("/api/ref/signup")
            .send({
                "first_name" : "sanidhya", 
                "last_name" : "singh",
                "email" : "sanu@gmail.com", 
                "phone" : "123456789", 
                "password" : "123456789"
            })
            .end((err, res) => { 
                res.should.have.status(200); 
                expect(res.body).that.includes.all.keys([ 'message' ])
            done(); 
            });
    }); 

    it("Should not signup same user with same email", (done) => {
        chai.request(server)
            .post("/api/ref/signup")
            .send({
                "first_name" : "sanidhya", 
                "last_name" : "singh",
                "email" : "sanu@gmail.com", 
                "phone" : "123456789", 
                "password" : "123456789"
            })
            .end((err, res) => { 
                res.should.have.status(400); 
                expect(res.body).that.includes.all.keys([ 'message' ])
            done(); 
            });
    }); 

    let jwt_token; 
    it("Should login the user", (done) => {
        chai.request(server)
            .post("/api/ref/login")
            .send({
                "email" : "sanu@gmail.com", 
                "password" : "123456789"
            })
            .end((err, res) => {
                jwt_token = res.body.jwt;
                // console.log(jwt_token);  
                res.should.have.status(200); 
                expect(res.body).that.includes.all.keys([ 'message' , 'jwt']);
            
            done(); 
            })
        
    })

    it("Should not login the user", (done) => {
        chai.request(server)
            .post("/api/ref/login")
            .send({
                "email" : "sanu@gmail.com", 
                "password" : "wrongPassword"
            })
            .end((err, res) => {
                res.should.have.status(400); 
                expect(res.body).that.includes.all.keys([ 'message']);
                
            done() 
            })
    })

    it("Should add a lead", (done) => {
        // console.log("add lead" , jwt_token);
        chai.request(server)
            .put("/api/ref/addLead")
            .set('authorization', 'jwt '+jwt_token)
            .send({
                "first_name" : "Anil", 
                "last_name" : "Singh", 
                "phone" : "123456789", 
                "address" : "kahi to rehta hai ye"
            })
            .end((err, res) => {
                res.should.have.status(200); 
                expect(res.body).that.includes.all.keys([ 'message']);
                // console.log(res.body);
                done();
            })
    })

    it("Should not add a lead", (done) => {
        // console.log("add lead" , jwt_token);
        chai.request(server)
            .put("/api/ref/addLead")
            .set('authorization', 'jwt asdaga')
            .send({
                "first_name" : "Anil", 
                "last_name" : "Singh", 
                "phone" : "123456789", 
                "address" : "kahi to rehta hai ye"
            })
            .end((err, res) => {
                res.should.have.status(500); 
                expect(res.body).that.includes.all.keys([ 'error']);
                // console.log(res.body);
                done();
            })
    })

    it("Should fetch all the leads", (done) => {
        chai.request(server)
            .get("/api/ref/getLeads")
            .set('authorization', 'jwt '+jwt_token)
            .end((err, res) => {
                res.should.have.status(200); 
                res.body.should.be.a('array');
                done();
            })
    })

})

describe('Testing Admin APIs ', () => {

    let jwt_token; 
    it("Should login the admin", (done) => {
        chai.request(server)
            .post("/api/admin/login")
            .send({ 
                "password" : process.env.ADMIN_PASS
            })
            .end((err, res) => {
                jwt_token = res.body.jwt;
                // console.log(jwt_token);  
                res.should.have.status(200); 
                expect(res.body).that.includes.all.keys(['jwt', 'message']);
            
            done(); 
            })
        
    })

    it("Should not login the admin", (done) => {
        chai.request(server)
            .post("/api/admin/login")
            .send({ 
                "password" : "wrongPassword"
            })
            .end((err, res) => {
                // console.log(jwt_token);  
                res.should.have.status(400); 
                expect(res.body).that.includes.all.keys(['message']);
            
            done(); 
            })
    })

    it("Should get all the Refree data", (done) => {
        chai.request(server)
            .get("/api/admin/getUsers")
            .set('authorization', 'jwt '+jwt_token)
            .end((err, res) => {
                // console.log(jwt_token);  
                res.should.have.status(200); 
                res.body.should.be.a('array');
                if(res.body.length > 0) expect(res.body[0]).that.includes.all.keys(['first_name', 'last_name', 'email', 'phone']);
            
            done(); 
            })
    })



})




