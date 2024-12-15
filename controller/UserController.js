const user = require('../models/UserModel.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const u = {
    main: (req, res) => {
        res.render('login'); 
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const foundUser = await user.findByEmail(email);

            if (!foundUser || !(await bcrypt.compare(password, foundUser.password))) {
                return res.status(401).json({ success: false, message: "Invalid credentials" });
            }

            const token = jwt.sign(
                { id: foundUser.id, email: foundUser.email, role: foundUser.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.json({ success: true, token, role: foundUser.role });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    },

    account: (req, res) => {
        res.render('admin/account');
    }
};

module.exports = u;

