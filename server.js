var express = require('express');
const app = express();
const port = 3003;
const hbs = require('hbs');
const path = require('path');
const session = require('express-session');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'mySecretKey', // Use a strong, unpredictable string
    resave: false,
    saveUninitialized: true,
}));

app.set('view engine', 'hbs');

const username = "fathima";
const password = "fathima@123";

app.get('/', (req, res) => {
    if (req.session.user) {
        res.render('homepage');
    } else {
        if (req.session.passwordworng) {
            res.render('login', { msg: "Invalid password" });
            req.session.passwordworng = false;  // Corrected typo
        } else {
            res.render('login');
        }
    }
});

app.post('/verify', (req, res) => {
    console.log(req.body);
    if (req.body.username === username && req.body.password === password) {
        req.session.user = req.body.username;
        res.redirect('/homepage');
    } else {
        req.session.passwordworng = true;
        res.redirect('/');
    }
});

app.get('/homepage', (req, res) => {
    if (req.session.user) {
        res.render('homepage');
    } else {
        if (req.session.passwordworng) {
            req.session.passwordworng = false;  // Corrected typo
            res.render('login', { msg: "Invalid password" });
        } else {
            res.render('login');
        }
    }
});
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send('Error while logging out');
        }
        res.render('login');  // Renders the logout.hbs view
    });
});



app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
