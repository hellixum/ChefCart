const server = require('../app');
const chai = require('chai'); 
const chaiHttp = require('chai-http'); 

var assert = chai.assert;   
var expect = chai.expect;    
var should = chai.should();
chai.use(chaiHttp); 

const sinon = require('sinon'); 
const { refrees, leads }= require('../server/models');  
const bcrypt = require('bcrypt'); 



describe('Testing Refree\'s APIs', () => {


    it("Should signup a new user", (done) => {

        let sinonStub = sinon.stub(refrees, "create").resolves(); 

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
                // console.log(res.body);
                res.should.have.status(200); 
                expect(res.body).that.includes.all.keys([ 'message' ])

                refrees.create.restore(); 

                done();
            });

            
    }); 

    it("Should not signup same user with same email", (done) => {

        let sinonStub = sinon.stub(refrees, "create").throws(); 

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
                res.should.have.status(500); 
                expect(res.body).that.includes.all.keys([ 'message' ])

                refrees.create.restore();

            done(); 
            });
    }); 

    let jwt_token; 
    it("Should login the user", (done) => {

        let sinonStub = sinon.stub(refrees, "findOne").returns({dataValues : {email: "sanu@gmail.com"}});
        let bcryptStub = sinon.stub(bcrypt, "compare").returns(true); 

        chai.request(server)
            .post("/api/ref/login")
            .send({
                "email" : "sanu@gmail.com", 
                "password" : "123456789"
            })
            .end((err, res) => {
                jwt_token = res.body.jwt;
                res.should.have.status(200); 
                expect(res.body).that.includes.all.keys([ 'message' , 'jwt']);

                refrees.findOne.restore(); 
                bcrypt.compare.restore(); 
            done(); 
            })
        
    })

    it("Should not login the user", (done) => {

        let sinonStub = sinon.stub(refrees, "findOne").returns({dataValues : {email: "sanu@gmail.com"}});
        let bcryptStub = sinon.stub(bcrypt, "compare").returns(false); 

        chai.request(server)
            .post("/api/ref/login")
            .send({
                "email" : "sanu@gmail.com", 
                "password" : "wrongPassword"
            })
            .end((err, res) => {
                res.should.have.status(400); 
                expect(res.body).that.includes.all.keys([ 'message']);
                
                refrees.findOne.restore(); 
                bcrypt.compare.restore();
            done() 
            })
    })

    it("Should add a lead", (done) => {
        
        let sinonStub = sinon.stub(leads, "create").returns({});

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
                leads.create.restore(); 
                done();
            })
    })

    it("Should not add a lead", (done) => {
        // console.log("add lead" , jwt_token);
        let sinonStub = sinon.stub(leads, "create").returns({});
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
                leads.create.restore(); 
                done();
            })
    })

    it("Should fetch all the leads", (done) => {
        let sinonStub = sinon.stub(leads, "findAll").returns([{
                "first_name" : "Anil", 
                "last_name" : "Singh", 
                "phone" : "123456789", 
                "address" : "kahi to rehta hai ye"
            }]);

        chai.request(server)
            .get("/api/ref/getLeads")
            .set('authorization', 'jwt '+jwt_token)
            .end((err, res) => {
                res.should.have.status(200); 
                res.body.should.be.a('array');

                leads.findAll.restore();
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
        let sinonStub = sinon.stub(refrees, "findAll").returns([{
                "first_name" : "sanidhya", 
                "last_name" : "singh",
                "email" : "sanu@gmail.com", 
                "phone" : "123456789", 
                "password" : "123456789"
            }]);
        chai.request(server)
            .get("/api/admin/getUsers")
            .set('authorization', 'jwt '+jwt_token)
            .end((err, res) => {
                // console.log(jwt_token);  
                res.should.have.status(200); 
                res.body.should.be.a('array');
                expect(res.body[0]).that.includes.all.keys(['first_name', 'last_name', 'email', 'phone']);

                refrees.findAll.restore();
            done(); 
            })
    })

    it("Should get all lead", (done) => {
        let sinonStub = sinon.stub(leads, "findAll").returns([{
                "first_name" : "Anil", 
                "last_name" : "Singh", 
                "phone" : "123456789", 
                "address" : "kahi to rehta hai ye", 
                "ref_email": "sanu@gmail.com", 
                "id": "1", 
                "reward": "34", 
                "status": "Junk"
            }]);
        chai.request(server)
            .get("/api/admin/getLeads")
            .set('authorization', 'jwt '+jwt_token)
            .send({
                "email" : "sanu@gmail.com"
            })
            .end((err, res) => {
                // console.log(jwt_token); 
                // console.log(res.body); 
                res.should.have.status(200); 
                res.body.should.be.a('array');
                expect(res.body[0]).that.includes.all.keys(['first_name', 'last_name', 'phone', 'ref_email', 'reward', 'status', 'id', 'address']);
                
                leads.findAll.restore();
            done(); 
            })
    })

    it("Should give a reward to a lead", (done) => {
        const sinonStub = sinon.stub(leads, "update").returns({}); 
        chai.request(server)
            .put("/api/admin/reward")
            .set('authorization', 'jwt '+jwt_token)
            .send({
                "id" : "1", 
                "reward" : "35"
            })
            .end((err, res) => {
                // console.log(jwt_token); 
                // console.log(res.body); 
                res.should.have.status(200); 
                expect(res.body).that.includes.all.keys(['message']);
                
                leads.update.restore(); 
            done(); 
            })
    })

    it("Should change the status of a lead", (done) => {
        const sinonStub = sinon.stub(leads, "update").returns({});
        chai.request(server)
            .put("/api/admin/status")
            .set('authorization', 'jwt '+jwt_token)
            .send({
                "id" : "1", 
                "status" : "Junk"
            })
            .end((err, res) => {
                // console.log(jwt_token); 
                // console.log(res.body); 
                res.should.have.status(200); 
                expect(res.body).that.includes.all.keys(['message']);
                
                leads.update.restore();
            done(); 
            })
    })

})




