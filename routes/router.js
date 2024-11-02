const express = require('express');
const router = express.Router();
const ucontroller = require('../controller/UserController.js');
const pcontroller = require('../controller/ProductController.js');



router.get('/', ucontroller.main);
router.get('/product', pcontroller.product);
router.post('/login', ucontroller.login);
router.get('/admin', pcontroller.admin);


module.exports = router;