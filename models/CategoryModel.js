const db = require('../config/db.js');

const c = {
    add: (data, callback) => {
        const query = "INSERT INTO categories (name) VALUES (?)";
        db.query(query,  [data.name], callback);
    }
};

module.exports = c;