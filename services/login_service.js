const { mysql, credentials, fs, logPath } = require('./db_credentials.js');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

async function signinBtn(username, password) {
    const pool = mysql.createPool(credentials);

    try {
        const con = await pool.getConnection();
        const [rows] = await con.query("SELECT id, password FROM users WHERE username = ?", [username]);
        const returnedId = rows.length > 0 ? rows[0].id : null;

        if (returnedId !== null) {
            const returnedPassword = rows.length > 0 ? rows[0].password : null;

            if (returnedPassword === password) {
                const loginDate = new Date();
                await fs.appendFile(logPath, `${loginDate}: User ${username} successfully connected\n`);
                const token = await generateToken(username, returnedId);
                return { success: true, message: "Successfully connected!", token };
            } else {
                return { success: false, message: 'Incorrect username or password!'};
            }
        } else {
            return { success: false, message: 'Incorrect username or password!'};
        }
    } catch (error) {
        console.error('Error: ', error);
    } finally {
        pool.end();
    }
}

function generateSecretKey(length) {
    return crypto.randomBytes(length).toString('hex');
}
const secretKey = generateSecretKey(32);

function generateToken(username, id) {
    return jwt.sign( { username, id }, secretKey);
}

module.exports = { signinBtn };
