const express = require('express');
const path = require("path");
const { signinBtn } = require('./services/login_service');
const registerBtn = require('./services/register_service');

const app = express();
const port = 2999;

app.use(express.static(path.join(__dirname, './frontend')));
app.use(express.json());

app.get('/home', (req, res) => {
    res.sendFile(path.resolve(__dirname, './frontend/main_page.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.resolve(__dirname, './frontend/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.resolve(__dirname, './frontend/register.html'));
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await signinBtn(username, password);

        if (result && result.success) {
            res.status(200).send('Logged in successfully!');
            res.header('Authorization', `Bearer ${result.token}`);
            res.redirect(302, 'http://localhost:2999/home');
        } else {
            console.log(`Login failed: ${result.message}`);
            res.status(401).send(`Login failed: ${result.message}`);
        }
    }catch (err) {
        console.error('Error during login: ', err);
        res.status(500).send('Internal server error');
    }
    
});

app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    const result = await registerBtn(username, password, email);
    if (result.success) {
        res.status(200).send();
    } else {
        res.status(400).send(`${result.message}`);
    }
    console.log(req.body);
})

app.listen(port, () => {
    console.log(`Web listening to port ${port}`);
});
