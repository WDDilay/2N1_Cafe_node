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
    },

    addProducts: (req, res) => {
        console.log("Category ID:", req.body.category_id);
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
    }
};

module.exports = p;