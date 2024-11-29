const db = require('../config/db.js');
const fs = require('fs');
const path = require('path');

const p = {
    get: (callback) => {
        const query = "SELECT * FROM categories";
        db.query(query, callback);
    },

    addProduct: (data, callback) => {
        console.log('Model: Incoming Data:', data);
    
        const getCategoryTypeQuery = "SELECT type FROM categories WHERE category_id = ?";
        db.query(getCategoryTypeQuery, [data.category_id], (err, result) => {
            if (err) {
                return callback(err);
            }
    
            const categoryType = result[0]?.type;
    
            const insertProductQuery = "INSERT INTO products (name, description, product_image, category_id) VALUES (?, ?, ?, ?)";
            db.query(insertProductQuery, [data.name, data.description, data.product_image, data.category_id], (err, result) => {
                if (err) {
                    return callback(err);
                }
    
                const product_id = result.insertId;
    
                if (categoryType === 'food') {
                    if (!data.price || isNaN(data.price)) {
                        return callback(new Error(`Invalid price: ${data.price}. Price is required for food products.`));
                    }
    
                    const insertFoodPriceQuery = "INSERT INTO product_sizes (product_id, name, price) VALUES (?, 'Default', ?)";
                    db.query(insertFoodPriceQuery, [product_id, data.price], (err) => {
                        if (err) {
                            return callback(err);
                        }
                        callback(null, result);
                    });
                } else if (categoryType === 'beverage') {
                    const beveragePrices = [
                        { size: 'Small', price: 29.00 },
                        { size: 'Medium', price: 39.00 },
                        { size: 'Large', price: 49.00 }
                    ];
    
                    const insertBeveragePriceQuery = "INSERT INTO product_sizes (product_id, name, price) VALUES (?, ?, ?)";
                    const tasks = beveragePrices.map(size => {
                        return new Promise((resolve, reject) => {
                            db.query(insertBeveragePriceQuery, [product_id, size.size, size.price], (err) => {
                                if (err) return reject(err);
                                resolve();
                            });
                        });
                    });
    
                    Promise.all(tasks)
                        .then(() => callback(null, result))
                        .catch(callback);
                } else {
                    callback(null, result);
                }
            });
        });
    },

    getProduct: (callback) => {
        const query = `
            SELECT 
                products.product_id, 
                products.name AS name, 
                products.description, 
                products.product_image, 
                categories.category_name AS category_name,
                categories.type AS category_type,
                CASE 
                    WHEN categories.type = 'food' THEN (
                        SELECT price 
                        FROM product_sizes 
                        WHERE product_sizes.product_id = products.product_id 
                        AND product_sizes.name = 'Default' 
                        LIMIT 1
                    )
                    ELSE NULL
                END AS price
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
    },

    updateProduct: (product_id, data, callback) => {
        const query = `
            UPDATE products 
            SET name = ?, description = ?, product_image = ?, category_id = ? 
            WHERE product_id = ?`;
        db.query(query, [data.name, data.description, data.product_image, data.category_id, product_id], callback);
    },

    getProductById: (product_id, callback) => {
        const query = "SELECT * FROM products WHERE product_id = ?";
        db.query(query, [product_id], callback);
    }
};

module.exports = p;