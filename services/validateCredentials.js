const { mysql, credentials, fs, logPath, jwt } = require('./db_credentials');
const { getPrivateKey } = require('./functions');

async function decryptToken(token) {
    try {
        const secretKey = (await getPrivateKey()).data;

        const decoded = jwt.verify(token, secretKey);
        return { success: true, message: 'Token devoded successfully', data: decoded };
    } catch (err) {
        console.error('Token verification failed:', err.message);
        return { success: false, message: `Token verification failed: ${err}`, data: null };
    }
}

async function validatePassword(username, password) {
    const pool = mysql.createPool(credentials);

    try {
        const con = await pool.getConnection();
        const [rows] = await con.query("SELECT id, password FROM users WHERE username = ?", [username]);
        const returnedId = rows.length > 0 ? rows[0].id : null;

        if (returnedId !== null) {
            const returnedPassword = rows.length > 0 ? rows[0].password : null;

            if (returnedPassword === password) {
                return { success: true, message: "Successfully connected!" };
            } else {
                return { success: false, message: 'Incorrect password!' };
            }
        } else {
            return { success: false, message: 'Incorrect username or password!' };
        }
    } catch (err) {
        console.error('Error during Password Validation: ', err);
        return { success: false, message: 'An internal error occured' };
    } finally {
        pool.end();
    }
}

async function validateData(username, password) {
    const validatePasswordResponse = await validatePassword(username, password);

    if (validatePasswordResponse.success) {
        return { success: true };
    } else {
        return { success: false, message: validatePasswordResponse.message };
    }
}

module.exports = { validateData, decryptToken };
