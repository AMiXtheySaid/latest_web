const { mysql, credentials, fs, logPath } = require("./db_credentials");
const { passwordChecker, emailChecker } = require('./functions');

const pool = mysql.createPool(credentials);

async function changePassword(username, newPassword, repeatNewPassword) {    
    if (newPassword !== repeatNewPassword) {
        return { success: false, message: 'The passwords do not match!' };
    }

    try {
        const con = await pool.getConnection();
        const [rows] = await con.query('SELECT id FROM users WHERE username = ?', [username]);
        const returnedId = rows.length > 0 ? rows[0].id : null;

        const passwordCheckerResult = passwordChecker(password);
        if (passwordCheckerResult.success === 'true') {
            await con.query(`UPDATE users SET password = ? WHERE id = ?`, [newPassword, returnedId]);
            return { success: true, message: 'Password changed successfully' };
        }
    } catch (err) {
        console.error('Error: ', err);
        return { success: false, message: 'An internal error occured' };
    } finally {
        pool.end();
    }
}

module.exports = { changePassword };
