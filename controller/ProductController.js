const product = require('../models/ProductModel.js');
const p = {
    product: (req, res) => {
        product.get((err, categoryResult) => {
            if (err) throw err;
    
            product.getProduct((err, productResult) => {
                if (err) throw err;
                
                res.render('admin/products', { 
                    category: categoryResult, 
                    product: productResult 
                });
            });
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
    },

    addProducts: (req, res) => {
        const { name, description} = req.body;
        const category_id = req.body.category_id;
        
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
    
        if (!category_id) {
            return res.status(400).send('Please select a valid category.');
        }
    
        const newProduct = {
            name,
            description,
            product_image: req.file.filename,  // File name from multer
            category_id: parseInt(category_id)  // Ensure category_id is an integer

        };
    
        product.addProduct(newProduct, (err, result) => {
            if (err) {
                console.error("Error adding product:", err);
                return res.status(500).send("Error adding product.");
            }
            res.redirect('/product'); // Redirect after successful insertion
        });
    },

    deleteProduct: (req, res) => {
        const productId = req.params.product_id;

        product.deleteProduct(productId, (err) => {
            if (err) {
                console.error("Error deleting product:", err);
                return res.status(500).send("Error deleting product.");
            }
            res.redirect('/product'); // Redirect after deletion
        });
    }
};

module.exports = p;