const express = require('express');
const path = require("path");
const app = express();
const port = 2999;

// import services
const { signinBtn } = require('./services/login_service');
const { registerBtn } = require('./services/register_service');
const { emailValidator, changePassword } = require('./services/email_password_service');
const { sign } = require('crypto');

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

app.get('/contact', async (req, res) => {
    res.sendFile(path.resolve(__dirname, './frontend/contact.html'));
})

app.get('/about-us', (req, res) => {
    res.sendFile(path.resolve(__dirname, './frontend/aboutUs.html'));
});

app.get('/change-password', async (req, res) => {
    res.sendFile(path.resolve(__dirname, './frontend/changePassword.html'));
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await signinBtn(username, password);

        if (result.success) {
            res.status(200).json({ success: result.success, message: 'Logged in successfully!', token: result.data });
        } else {
            console.log(`Login failed: ${result.message}`);
            res.status(400).json({ success: false, message: `${result.message}` });
        }
    } catch (err) {
        console.error('Error during login: ', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    try {
        const result = await registerBtn(username, password, email);

        if (result.success) {
            // automatically log you in after a successfull registration
            const loginRes = await signinBtn(username, password);
            if (loginRes.success && result.success) {
                res.status(200).json({ success: true, message: 'Logged in autoatically' });
            } else if (result.success) {
                res.status(200).json({ success: true, message: 'Successfully registered!' });
            }
        } else { 
            // bad credentials/ credentials don't meet the requirements/ already taken username
            res.status(400).json({ success: false, message: `${result.message}` });
        }
    } catch (err) {
        console.error('Error during register: ', err);
        res.status(500).json({ success: false, message:'Internal server error' });
    }
})

app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    await emailValidator(email);
})

app.post('/change-password', async (req, res) => {
    const { oldPassword, newPassword, repeatNewPassword } = req.body;

})

app.listen(port, () => {
    console.log(`Web listening to port ${port}`);
});
