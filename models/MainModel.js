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
    
            // Aggregate products and their sizes
            const products = {};
    
            results.forEach(row => {
                // Initialize product object if not already created
                if (!products[row.product_id]) {
                    products[row.product_id] = {
                        product_id: row.product_id,
                        name: row.name,
                        description: row.description,
                        product_image: row.product_image,
                        category_type: row.category_type,
                        category_name: row.category_name,
                        sizes: []  // Array to hold sizes (for beverages)
                    };
                }
    
                // For beverages, add size and price information
                if (row.size_name && row.size_price) {
                    products[row.product_id].sizes.push({
                        name: row.size_name,
                        price: row.size_price
                    });
                }
            });
    
            // Convert products object to an array for easier handling
            const productArray = Object.values(products);
    
            // Return the aggregated list of products
            callback(null, productArray);
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

        db.query(query, (err, results) => {
            if (err) return callback(err);

            const products = {};

            results.forEach(row => {
                if (!products[row.product_id]) {
                    products[row.product_id] = {
                        product_id: row.product_id,
                        name: row.name,
                        description: row.description,
                        product_image: row.product_image,
                        category_type: row.category_type,
                        category_name: row.category_name,
                        sizes: []
                    };

                    // If the product is a 'food' type and has a 'Default' size
                    if (row.category_type === 'food' && row.size_name === 'Default') {
                        products[row.product_id].price = row.size_price; // Assign the default price
                    }
                }

                // Add size details for beverages or food with specific sizes
                if (row.size_name && row.size_price) {
                    products[row.product_id].sizes.push({
                        name: row.size_name,
                        price: row.size_price
                    });
                }
            });

            callback(null, Object.values(products));
        });
    }
    
}    

module.exports = m;
