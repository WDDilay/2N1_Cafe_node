const product = require('../models/ProductModel.js');
const p = {
    product: (req, res) => {
        product.get((err, result) => {
            if (err) throw err;
            res.render('admin/products', { category: result }); 
        });
    },

    admin: (req, res) => {
        res.render('admin/admin');
    },
    
    addForm: (req, res) => {
        product.get((err, result) => {
            if (err) throw err;
            res.render('admin/add-product', { category: result }); 
        });
    }
};

module.exports = p;