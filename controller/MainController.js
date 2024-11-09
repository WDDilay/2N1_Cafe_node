const product = require('../models/ProductModel.js');

const m = {
    kiosk: (req, res) => {
        product.get((err, categoryResult) => {
            if (err) throw err;
    
            product.getProduct((err, productResult) => {
                if (err) throw err;
                
                res.render('mainpage/kiosk', { 
                    category: categoryResult, 
                    product: productResult 
                });
            });
        });
    }
};

module.exports = m;