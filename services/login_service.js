const { mysql, credentials, fs, logPath, secretKey_credentials } = require('./db_credentials.js');
const jwt = require('jsonwebtoken');
const { getPrivateKey, getId } = require('./functions.js');

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
                const token = await generateToken(returnedId, username, password);

                return { success: true, message: "Successfully connected!", data: token };
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

async function generateToken(id, username, password) {
    const restult = await getPrivateKey();

    const secretKey = restult.data;
    if (secretKey !== null) {
        return { success: true, data: jwt.sign( { id, username, password }, secretKey) };
    } else {
        console.log('Error: no secretKey found');
        return { success: false, message: 'No secret key found!' };
    }
}

module.exports = { signinBtn };
