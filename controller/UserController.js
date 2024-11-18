const user = require('../models/UserModel.js');
const u = {

    main: (req, res) => {
        res.render('login'); 
    },

    login: (req, res) => {
        const { email, password } = req.body;

        user.findByEmail(email, (err, foundUser) => {
            if (err) {
                return res.status(500).send("Internal Server Error");
            }
            if (!foundUser || foundUser.password !== password) {
                return res.status(401).send("Invalid credentials");
            }
            if (foundUser.role === 'admin') {
                return res.redirect('/admin');
            } else {
                res.status(403).send("Access denied");
            }
        });
    },

    account: (req, res) => {
        res.render('admin/account');
    }
};

module.exports = u;