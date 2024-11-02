const product = require('../models/ProductModel.js');
const p = {
    product: (req, res) => {
        res.render('admin/products');
    },

    admin: (req, res) => {
        res.render('admin/admin');
    },
    
    addForm: (req, res) => {
        res.render('admin/add-product');
    }
};

module.exports = p;