const express = require('express');
const router = express.Router();
const controller = require('../controller/UserController.js');



router.get('/', controller.main);

module.exports = router;