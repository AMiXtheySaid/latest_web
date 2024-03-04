const { secretKey_credentials } = require('./db_credentials');

async function getPrivateKey() {
    const pool = mysql.createPool(secretKey_credentials);

    try {
        const con = await pool.getConnection();
        const [rows] = await con.query('SELECT privateKey FROM privatekey LIMIT 1');
        const privateKey = rows.length > 0 ? rows[0].privateKey : null;

        if (privateKey !== null) {
            return { success: true, data: privateKey };
        } else {
            return { success: false, message: 'No private key found' };
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
        console.log("Password must contain at least 8 characters!");
        return { success: false, message: 'Password must contain at least 8 characters!' };
    }

    if (!/[A-Z]/.test(password)) {
        console.log("Password must contain at least 1 upper case!");
        return { success: false, message: 'Password must contain at least 1 upper case!' };
    }

    return { success: true };
}

function emailChecker(email) {
    if (email.length === 0)
        return { success: false, message: 'Email field cannot be left empty!' };

    return { success: validator.isEmail(email), message: 'Invalid email address' };
    
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

function generateSecretKey() {
    return crypto.randomBytes(32).toString('hex');
}

module.exports = { getPrivateKey, passwordChecker, emailChecker, getId };
