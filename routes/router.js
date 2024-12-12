const express = require('express');
const router = express.Router();
const path = require('path');
const ucontroller = require('../controller/UserController.js');
const pcontroller = require('../controller/ProductController.js');
const ccontroller = require('../controller/Category.js');
const mcontroller = require('../controller/MainController.js');
const cartController = require('../controller/CartController.js');
const orderController = require('../controller/Order.js');

const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads'); 
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Use a unique filename by appending the timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);  // eg. product_image-123456789.png
    }
});


const upload = multer({ storage: storage });

//user routes
router.get('/', ucontroller.main);
router.post('/login', ucontroller.login);
router.get('/account', ucontroller.account);


//product routes
router.get('/product', pcontroller.product);
router.get('/add-form', pcontroller.addForm);
router.post('/add-products', upload.single('product_image'), pcontroller.addProducts);
router.post('/delete-product/:product_id', pcontroller.deleteProduct);



//category routes
router.get('/addcategory', ccontroller.addCategory);
router.post('/addcategories', ccontroller.addCategories);
router.post('/delete-category/:category_id', ccontroller.deleteCategory);
router.get('/edit-products/:product_id', pcontroller.editProducts);
router.post('/edit-product/:product_id', upload.single('product_image'), pcontroller.editProduct);


//main routes

router.get('/kiosk', mcontroller.kiosk);
router.get('/kiosk/products/:category_id', mcontroller.filterProductsByCategory);

//cart routes
router.post('/cart/add', cartController.addToCart);
router.get('/cart/items', cartController.getCartItems);
router.delete('/cart/item/:cartItemId', cartController.deleteCartItem);
router.delete('/cart/items', cartController.deleteAllCartItems);
router.post('/cart/proceed-to-payment', cartController.proceedToPayment);


//order routes
router.get('/orders', orderController.orders);
router.post('/orders/mark-done', orderController.markDone);
router.get('/admin', orderController.admin);
router.get('/export-sales', orderController.exportSales);


module.exports = router;