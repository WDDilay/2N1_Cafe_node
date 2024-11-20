const db = require('../config/db.js');

const c = {
    add: (data, callback) => {
        const query = "INSERT INTO categories (category_name, type) VALUES (?, ?)";
        db.query(query, [data.name, data.type], callback);
    },

    delete: (category_id, callback) => {
        const deleteCategory = "DELETE FROM categories WHERE category_id = ?";
        db.query(deleteCategory, [category_id], (err, result) => {
            if (err) {
                console.error('Error deleting category:', err);
                return callback(err, null);
            }
            callback(null, result);
        });
    } 
};

module.exports = c;