const category = require('../models/CategoryModel.js');
const db = require('../config/db.js');

const c = {
    
    addCategory: (req, res) => {
        res.render('admin/category')
    },

    addCategories: (req, res) => {
        if (req.method === 'POST') {
            const { name } = req.body;
    
            category.add({name}, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error adding category");
            }
            
            res.redirect('/product');
        });
        } else {
            res.render('/addcategory');
        }
    }
};

module.exports = c;