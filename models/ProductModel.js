const db = require('../config/db.js');

const p = {
    get: (callback) => {
        const query = "SELECT * FROM categories";
        db.query(query, callback);
    }
};

module.exports = p;