const e = require("express");
const { mysql, credentials, fs, logPath } = require("./db_credentials");

async function emailValidator(email) {
    const pool = mysql.createPool(credentials);

    try {
        const con = await pool.getConnection();
        const [rows] = await con.query('SELECT id FROM users WHERE email = ?', [email]);
        const returnedId = rows.length > 0 ? rows[0].id : null;
        
        if (returnedId !== null) {
            return { success: true, message: 'User successfully found! Sending a link to change the password'};
        } else {
            return { success: false, message: 'No user with such email found' };
        }
    } catch (err) {
        console.error('Error: ', err);
        return { success: false, message: 'An internal error occured' };
    } finally {
        pool.end();
    }
}

async function resetPassword(email, newPassword, repeatNewPassword) {
    if (newPassword !== repeatNewPassword) {
        return { success: false, message: 'The passwords do not match' };
    }
    const pool = mysql.createPool(credentials);

    try {
        // fa functia asta
        
    } catch (err) {
        console.error('Error: ', err);
        return { success: false, message: 'An internal error occured' };
    } finally {
        pool.end();
    }
}

module.exports = { emailValidator, resetPassword };
