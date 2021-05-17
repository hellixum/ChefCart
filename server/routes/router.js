const express = require('express'); 
const router = express.Router(); 
const adminCon = require('../controller/adminController'); 
const refreeCon = require('../controller/refreeController');
const auth = require('../controller/auth'); 


/// Admin APIs
router.use('/admin/createTable', adminCon.createTable); 
router.post('/admin/login', adminCon.login);
router.get('/admin/getUsers', auth.adminAuth, adminCon.refreeData);
router.get('/admin/getLeads', auth.adminAuth, adminCon.getLeads); 
router.put('/admin/reward', auth.adminAuth, adminCon.reward);
router.put('/admin/status', auth.adminAuth, adminCon.changeStatus);

// Refree's APIs
router.post('/ref/login', refreeCon.login); 
router.post('/ref/signup', refreeCon.signup);
router.get('/ref/getLeads', auth.userAuth, refreeCon.getLeads);  
router.put('/ref/addLead', auth.userAuth, refreeCon.addLead); 
router.get('/ref/leadsBetween', auth.userAuth, refreeCon.leadsBetween); 

 
module.exports = router; 