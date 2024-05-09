const { mysql, credentials, fs, logPath } = require("./db_credentials");
const { passwordChecker, getId, generateToken } = require('./functions');

async function changePassword(username, newPassword, repeatNewPassword) {    
    if (newPassword !== repeatNewPassword) {
        return { success: false, message: 'The passwords do not match!' };
    }
    const pool = mysql.createPool(credentials);

    try {
        const con = await pool.getConnection();
        var returnedId = (await getId(username)).data;

        const passwordCheckerResult = passwordChecker(newPassword);
        if (passwordCheckerResult.success) {
            await con.query(`UPDATE users SET password = ? WHERE id = ?`, [newPassword, returnedId]);
            const token = (await generateToken(returnedId, username, newPassword)).data;
            return { success: true, message: 'Password changed successfully', data: token };
        } else {
            return { success: false, message: passwordCheckerResult.message };
        }
    } catch (err) {
        console.error('Error during Password Changing: ', err);
        return { success: false, message: 'An internal error occured' };
    } finally {
        pool.end();
    }
}

module.exports = { changePassword };
