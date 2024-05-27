const express = require('express');
const path = require("path");
const app = express();
const port = 2999;

// import services
const { signinBtn } = require('./services/login_service.js');
const { registerBtn } = require('./services/register_service.js');
const { emailValidator, changePassword } = require('./services/email_password_service.js');
const { validateData, decryptToken } = require('./services/validateCredentials.js');
const { deleteAccount } = require('./services/deleteAccountService.js');
const { getServices } = require('./services/getServicesService.js');
const { getDoctors } = require('./services/getDoctorsService.js');
const { getAppointment } = require('./services/getAppointment.js');
const { getPastAppointments } = require('./services/pastAppointments.js');

app.use(express.static(path.join(__dirname, './frontend')));
app.use(express.json());

/////////////////////////////////
// .get web pages
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './frontend/main_page.html'));
});

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

app.get('/forbidden', async (req, res) => {
    res.sendFile(path.resolve(__dirname, './frontned/forbidden.html'));
})

app.get('/delete-account', async (req, res) => {
    res.sendFile(path.resolve(__dirname, './frontend/deleteAccount.html'));
})

app.get('/appointments', async (req, res) => {
    res.sendFile(path.resolve(__dirname, './frontend/appointments.html'));
});

app.get('/past-appointments', async (req, res) => {
    res.sendFile(path.resolve(__dirname, './frontend/pastAppointments.html'));
})

/////////////////////////////////////////////////////////////////
// .put .post .delete updates 

app.post('/register-btn', async (req, res) => {
    const { username, password, email, phone } = req.body;

    try {
        const result = await registerBtn(username, password, email, phone);

        if (result.success) {
            res.status(200).json({ success: true, message: 'Successfully registered' });
        } else { 
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

app.put('/change-password-btn', async (req, res) => {
    const { token, oldPassword, newPassword, repeatNewPassword } = req.body;
    const decryptedToken = (await decryptToken(token)).data;

    const username = decryptedToken.username;

    try {
        const validateToken = await validateData(username, decryptedToken.password)
        const oldPasswordCheck = await validateData(username, oldPassword);

        if (oldPasswordCheck.success && validateToken.success) {
            const result = await changePassword(username, newPassword, repeatNewPassword);

            if (result.success) {
                const newToken = result.data;
                res.status(200).json({ success: true, message: result.message, token: newToken });
            } else {
                res.status(400).json({ success: false, message: result.message });
            }
        } else {
            res.status(400).json({ success: false, message: oldPasswordCheck.message });
        }
    } catch {
        res.status(401).json({ success: false, message: "Unauthorized" });
    }
});

app.delete('/delete-account-btn', async (req, res) => {
    const { token, password } = req.body;

    const decryptedToken = (await decryptToken(token)).data;
    const username = decryptedToken.username;
    
    if (password === decryptedToken.password) {
        const result = await deleteAccount(username);
    
        if (result.success) {
            res.status(200).json({ success: true, message: "User successfully deleted" });
        } else {
            res.status(401).json({ success: false, message: 'Unauthorised' });
        }
    } else {
        res.status(400).json({ success: false, message: "Wrong Password" });
    }

});

app.post('/get-an-appointment', async (req, res) => {
    const doctor = req.headers['doctor'];
    const service = req.headers['service'];
    const token = req.headers['authorization'];
    const date = req.headers['thedate'];

    if (doctor && service) {
        const appointment = await getAppointment(token, service, doctor, date);

        if (appointment.success) {
            res.status(200).json({ success: true, message: 'Appointment successfully created' });
        } else {
            res.status(400).json({ success: true, message: appointment.message });
        }
    } else {
        res.status(400).json({ success: false, message: "Please fill all the fields" })
    }

});

/////////////////////////////////////////
// .get data for the web pages

app.get('/doctors', async (req, res) => {
    const { service } = req.body;
    const { returnedDoctors } = (await getDoctors(service));

    res.status(200).json({ returnedDoctors });
});

app.get('/services', async (req, res) => {
    const { doctor } = req.body;
    const { returnedServices } = (await getServices(doctor)).data;

    res.status(200).json({ returnedServices });
});

app.get('/appointments-data', async (req, res) => {
    const returnedDoctors = (await getDoctors()).data;
    const returnedServices = (await getServices()).data;

    res.status(200).json({ returnedDoctors, returnedServices });
});

app.get('/home-validate-token', async (req, res) => {
    const token = req.headers['authorization'];

    const decryptedToken = (await decryptToken(token)).data;
    const username = decryptedToken.username;
    const password = decryptedToken.password;

    try {
        const validateDataResponse = await validateData(username, password);

        if (validateDataResponse.success) {
            res.status(200).json({ success: true, token: token, data: username });
        } else {
            res.status(401).json({ success: false, message: 'Unauthorized' });
        }
    } catch {
        res.status(500).json({ success: false, message: 'An internal error occurred' });
    }
});

app.get('/login-info', async (req, res) => {
    const username = req.headers['username'];
    const password = req.headers['password'];

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

app.get('/get-past-appointments', async (req, res) => {
    const token = req.headers['authorization'];

    const user = (await decryptToken(token)).data.username;
    const appointments = await getPastAppointments(user);

    if (appointments.success) {
        res.status(200).json({ data: appointments.data });
    } else {
        res.status(400).json({ success: false, message: "An error occured retrieving the past appointments" });
    }
})

/////////////////////////////////////////////////
// do not touch

app.listen(port, () => {
    console.log(`Web listening to port ${port}`);
});
