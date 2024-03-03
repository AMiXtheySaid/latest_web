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
    } catch (err) {
        console.log('Error: ', err);
        return { success: false, message: 'An internal error occured' };
    } finally {
        pool.end();
    }

    return returnedId;
}

async function secretKeyRequest(username) {
    const returnedId = await getId(username); 
    const pool = mysql.createPool(secretKey_credentials);

    try {
        const con = await pool.getConnection();
        const [rows] = await con.query("SELECT value FROM secretKey WHERE owner_id = ?", [returnedId]);
        const secretKey = rows.length > 0 ? rows[0].value : null;
    } catch (err) {
        console.log('Error: ', err);
        return { success: false, message: 'An internal error occured' };
    } finally {
        pool.end();
    }

    return secretKey;
}

async function generateToken(id, username, password) {
    const secretKey = await secretKeyRequest(username);
    return jwt.sign( { id, username, password }, secretKey);
}

module.exports = { signinBtn };
