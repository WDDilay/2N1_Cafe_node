const db = require('../config/db.js');

const m = {
    // Fetch products by category_id
    getProductsByCategory: (category_id, callback) => {
        const query = `
            SELECT 
                products.product_id, 
                products.name AS name, 
                products.description, 
                products.product_image, 
                categories.type AS type, 
                categories.category_name AS category_name
            FROM products
            JOIN categories ON products.category_id = categories.category_id
            WHERE products.category_id = ?
        `;
        db.query(query, [category_id], (err, results) => {
            if (err) {
                console.error("Query error:", err); 
                return callback(err);
            }
            callback(null, results);
        });
    },

    // Fetch all products
    getAllProducts: (callback) => {
        const query = `
            SELECT 
                products.product_id, 
                products.name, 
                products.description, 
                products.product_image, 
                categories.type AS type, 
                categories.category_name
            FROM products
            JOIN categories ON products.category_id = categories.category_id
        `;
        db.query(query, callback);
    }
}

module.exports = m;
