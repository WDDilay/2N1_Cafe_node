const express = require('express');
const router = express.Router();
const ucontroller = require('../controller/UserController.js');
const pcontroller = require('../controller/ProductController.js');
const ccontroller = require('../controller/Category.js');


//user routes
router.get('/', ucontroller.main);
router.post('/login', ucontroller.login);


//product routes
router.get('/product', pcontroller.product);
router.get('/admin', pcontroller.admin);
router.get('/add-form', pcontroller.addForm);


//category routes
router.get('/addcategory', ccontroller.addCategory);
router.post('/addcategories', ccontroller.addCategories);


module.exports = router;