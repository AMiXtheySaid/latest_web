const { mysql, credentials, fs, logPath, secretKey_credentials } = require('./db_credentials.js');
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
                const token = await generateToken(returnedId, username, password);

                return { success: true, message: "Successfully connected!", token };
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

async function getId(username) {
    let pool = mysql.createPool(credentials);

    try {
        var con = await pool.getConnection();
        var [rows] = await con.query("SELECT id FROM users WHERE username = ?", [username]);
        const returnedId = rows.length > 0 ? rows[0].id : null;
        return { success: true, data: returnedId };
    } catch (err) {
        console.log('Error: ', err);
        return { success: false, message: 'An internal error occured' };
    } finally {
        pool.end();
    }
}

async function secretKeyRequest(username) {
    const returnedId = await getId(username).data; 
    const pool = mysql.createPool(secretKey_credentials);

    try {
        const con = await pool.getConnection();
        const [rows] = await con.query("SELECT value FROM secretKey WHERE owner_id = ?", [returnedId]);
        const secretKey = rows.length > 0 ? rows[0].value : null;

        return { success: true, data: secretKey };
    } catch (err) {
        console.log('Error: ', err);
        return { success: false, message: 'An internal error occured' };
    } finally {
        pool.end();
    }
}

async function generateToken(id, username, password) {
    const secretKey = await secretKeyRequest(username).data;

    if (secretKey !== null) {
        return jwt.sign( { id, username, password }, secretKey);
    } else {
        console.log('Error: no secretKey found');
        return { success: false, message: 'No secret key found for this user. Ask an admin for one!' };
    }
}

module.exports = { signinBtn };
