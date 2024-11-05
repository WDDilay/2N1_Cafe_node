const db = require('../config/db.js');
const fs = require('fs');
const path = require('path');

const p = {
    get: (callback) => {
        const query = "SELECT * FROM categories";
        db.query(query, callback);
    },

    addProduct: (data, callback) => {
        const query = "INSERT INTO products (name, description, product_image, category_id) VALUES (?, ?, ?, ?)";
        db.query(query,  [data.name, data.description, data.product_image, data.category_id], callback);
    },

    getProduct: (callback) => {
        const query = `
            SELECT products.product_id, products.name AS name, products.description, products.product_image, categories.category_name AS category_name
    FROM products
    JOIN categories ON products.category_id = categories.category_id
        `;
        db.query(query, callback);
    },

    deleteProduct: (product_id, callback) => {
        // First, get the product image filename
        const getImageQuery = "SELECT product_image FROM products WHERE product_id = ?";
        db.query(getImageQuery, [product_id], (err, result) => {
            if (err) return callback(err);

            if (result.length > 0) {
                const imageFile = result[0].product_image;
                const filePath = path.join(__dirname, '../uploads', imageFile); // Ensure the path matches the upload location

                // Delete the image file
                fs.unlink(filePath, (err) => {
                    if (err) console.error("Error deleting image file:", err);
                });
            }

            // Now delete the product from the database
            const deleteQuery = "DELETE FROM products WHERE product_id = ?";
            db.query(deleteQuery, [product_id], (err, result) => {
                if (err) {
                    console.error('Error deleting product:', err);
                    return callback(err, null);
                }
                // Call callback with result if successful
                callback(null, result);
            });
        });
    }
};

module.exports = p;