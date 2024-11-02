const express = require('express');
const router = express.Router();
const ucontroller = require('../controller/UserController.js');
const pcontroller = require('../controller/ProductController.js');
const ccontroller = require('../controller/Category.js');



router.get('/', ucontroller.main);
router.get('/product', pcontroller.product);
router.post('/login', ucontroller.login);
router.get('/admin', pcontroller.admin);
router.get('/add-form', pcontroller.addForm);
router.get('/addcategory', ccontroller.addCategory);
router.post('/addcategories', ccontroller.addCategories);


module.exports = router;