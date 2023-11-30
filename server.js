const express = require ('express');
const path = require ('path');
const app = express();
const port = 2999;
const signinBtn = require('/services/login_service.js')

app.use(express.static(path.join(__dirname, '/frontend')))
app.use(express.json());

app.get('/home', (req, res) => {
    res.sendFile(path.resolve(__dirname, `frontend/main_page.html`))
})

app.get('/login', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend/login.html'));
})

app.get('/register', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend/register.html'));
})

app.post('/login', (req, res) => {
    const {username, password} = req.body;
    signinBtn(username, password);
    console.log(req.body);
    res.status(200).send({});
})

app.listen(port, () => {
    console.log(`Web listening to port ${port}`)
})