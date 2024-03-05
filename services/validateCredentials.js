const { mysql, credentials, fs, logPath, jwt } = require('./db_credentials');
const { getPrivateKey, getId } = require('./functions');

async function decryptToken(token) {
    try {
        const privateKey = await getPrivateKey();

        const decoded = jwt.verify(token, privateKey);
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
                return { success: false, message: 'Incorrect username or password!' };
            }
        } else {
            return { success: false, message: 'Incorrect username or password!' };
        }
    } catch (err) {
        console.error('Error: ', err);
        return { success: false, message: 'An internal error occured' };
    } finally {
        pool.end();
    }
}

async function validateData(username, password, token) {
    const validatePasswordResponse = await validatePassword(username, password);
    const decryptTokenResponse = (await decryptToken(token)).data;
    const id = getId(username);

    if (validatePasswordResponse.success && decryptTokenResponse.success) {
        if (decryptTokenResponse.id === id && decryptTokenResponse.username === username && decryptTokenResponse.password === password) {
            return { success: true };
        } else {
            return { success: false };
        }
    } else {
        return { success: false };
    }
}

module.exports = { validateData };
