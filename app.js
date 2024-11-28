const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes/router.js')
const path = require('path');
const session = require('express-session');
app.use(express.json());
app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Set `secure: true` if using HTTPS
    })
);



app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000');
});