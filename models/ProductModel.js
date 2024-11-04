const db = require('../config/db.js');

const p = {
    get: (callback) => {
        const query = "SELECT * FROM categories";
        db.query(query, callback);
    },

    addProduct: (data, callback) => {
        const query = "INSERT INTO products (name, description, product_image, category_id) VALUES (?, ?, ?, ?)";
        db.query(query,  [data.name, data.description, data.product_image, data.category_id], callback);
    }
};

module.exports = p;