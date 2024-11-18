const product = require('../models/ProductModel.js');
const main = require('../models/MainModel.js');

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
    },

    filterProductsByCategory: (req, res) => {
        const categoryId = req.params.category_id;
    
        if (categoryId === "all") {
            main.getAllProducts((err, results) => {
                if (err) {
                    console.error('Error fetching all products:', err);
                    return res.status(500).json({ error: 'Failed to fetch products.' });
                }
                res.json(results); 
            });
        } else {
            main.getProductsByCategory(categoryId, (err, results) => {
                if (err) {
                    console.error('Error fetching products by category:', err);
                    return res.status(500).json({ error: 'Failed to fetch products.' });
                }
                res.json(results);
            });
        }
    }
    
    
    
};

module.exports = m;