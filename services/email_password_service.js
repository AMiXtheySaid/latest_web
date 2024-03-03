const { mysql, credentials, fs, logPath } = require("./db_credentials");

const pool = mysql.createPool(credentials);

async function emailValidator(email) {
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

async function changePassword(username, newPassword, repeatNewPassword) {
    const con = await pool.getConnection();
    const [rows] = await con.query('SELECT id FROM users WHERE username = ?', [username]);
    const returnedId = rows.length > 0 ? rows[0].id : null;
    
    if (newPassword !== repeatNewPassword) {
        return { success: false, message: 'The passwords do not match' };
    }

    try {
        if (passwordChecker === 1) {
            if (newPassword === repeatNewPassword) {
                await con.query(`UPDATE users SET password = ? WHERE id = ?`, [newPassword, returnedId]);
                return { success: true, message: 'Password successfully changed' };
            } else {
                return { success: false, message: "The new passwords don't match" };
            }  
        }
    } catch (err) {
        console.error('Error: ', err);
        return { success: false, message: 'An internal error occured' };
    } finally {
        pool.end();
    }
}

function passwordChecker(password) {
    if (password.length < 8) {
        return { success: false, message: "Password must contain at least 8 characters!" };
    }

    if (!/[A-Z]/.test(password)) {
        return { success: false, message: "Password must contain at least 1 upper case!" };
    }

    return 1;
}

module.exports = { emailValidator, changePassword };
