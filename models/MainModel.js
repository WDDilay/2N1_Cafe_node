const db = require('../config/db.js');

const m = {
    // Fetch products by category_id
    getProductsByCategory: (category_id, callback) => {
        const query = `
            SELECT 
                p.product_id, 
                p.name, 
                p.description, 
                p.product_image, 
                c.type AS category_type, 
                c.category_name,
                ps.name AS size_name,
                ps.price AS size_price
            FROM products p
            JOIN categories c ON p.category_id = c.category_id
            LEFT JOIN product_sizes ps ON p.product_id = ps.product_id
            WHERE p.category_id = ?
        `;
        db.query(query, [category_id], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    
    getAllProducts: (callback) => {
        const query = `
            SELECT 
                p.product_id, 
                p.name, 
                p.description, 
                p.product_image, 
                c.type AS category_type, 
                c.category_name,
                ps.name AS size_name,
                ps.price AS size_price
            FROM products p
            JOIN categories c ON p.category_id = c.category_id
            LEFT JOIN product_sizes ps ON p.product_id = ps.product_id
        `;
        db.query(query, callback);
    }
}    

module.exports = m;
