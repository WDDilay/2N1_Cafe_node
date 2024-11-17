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
    },

    editProducts: (req, res) => {
        const productId = req.params.product_id;  // Capture the product ID from the URL
        console.log("Product ID from URL:", productId);
        product.getProductById(productId, (err, productResult) => {
            if (err) {
                console.error("Error fetching product for edit:", err);
                return res.status(500).send("Error fetching product.");
            }
            console.log("Fetched product:", productResult);
            // Make sure productResult is not empty or undefined
            if (!productResult || productResult.length === 0) {
                return res.status(404).send("Product not found.");
            }
    
            // Fetch all categories for the dropdown
            product.get((err, categories) => {
                if (err) {
                    console.error("Error fetching categories:", err);
                    return res.status(500).send("Error fetching categories.");
                }
    
                // Pass product and categories data to the view
                res.render('admin/edit-product', {
                    product: productResult[0],  // Ensure you pass the first product from the array
                    category: categories
                });
            });
        });
    },

    editProduct: (req, res) => {
        const productId = req.params.product_id; // Capture the product ID from the URL
    
        // Ensure the form data is extracted first
        const { name, description, category_id, existing_image } = req.body; // Destructure fields from the body
    
        // Use existing image if no new file is uploaded
        let productImage = existing_image;  // Default to existing image if no new image uploaded
    
        // If a new image is uploaded, use the uploaded image
        if (req.file) {
            productImage = req.file.filename;
        }
    
        // Ensure category_id is correctly parsed
        const parsedCategoryId = parseInt(category_id, 10);
    
        // Validation: Make sure all fields are present
        if (!name || !description || !parsedCategoryId) {
            return res.status(400).send('All fields are required.');
        }
    
        // Prepare the updated product data
        const updatedProduct = {
            name,
            description,
            product_image: productImage,  // Use the new or existing image
            category_id: parsedCategoryId  // Ensure category_id is an integer
        };
    
        // Proceed with updating the product in the database
        product.updateProduct(productId, updatedProduct, (err, result) => {
            if (err) {
                console.error("Error updating product:", err);
                return res.status(500).send("Error updating product.");
            }
            // Redirect after successful update
            res.redirect('/product');
        });
    }
    
    
    
    
};

module.exports = p;