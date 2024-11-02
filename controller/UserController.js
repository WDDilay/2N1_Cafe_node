const user = require('../models/UserModel.js');
const u = {
    main:(req, res) => {
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
                // Redirect to admin page if user is an admin
                return res.redirect('/admin');
            } else {
                // Handle if the user is not an admin (optional)
                res.status(403).send("Access denied");
            }
        });
    }
};

module.exports = u;