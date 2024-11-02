const db = require('../config/db.js');

const user = {
    findByEmail: (email, callback) => {
        const sql = 'SELECT * FROM users WHERE username = ?';
        db.query(sql, [email], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results[0]);
        });
    }
}

module.exports = user;