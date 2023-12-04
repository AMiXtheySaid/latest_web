const express = require('express');
const path = require("path");
const signInBtn = require('./services/login_service');
const { resolveObjectURL } = require('buffer');
const signinBtn = require('./services/login_service');
const registerBtn = require('./services/register_service');

const app = express();
const port = 2999;

app.use(express.static(path.join(__dirname, '/frontend')));
app.use(express.json());

app.get('/home', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend/main_page.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend/register.html'));
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    signinBtn(username, password);
    console.log(req.body);
    if (res.statusMessage === true) { /// vezi aici
        res.status(200).send('bravo ba');
    } else {
        res.status(400).send('wrong bruh');
    }
});

app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    registerBtn(username, password, email);
    console.log(req.body);
    res.status(200).send();
})

app.listen(port, () => {
    console.log(`Web listening to port ${port}`);
});
