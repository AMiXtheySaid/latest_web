const { mysql, credentials, validator, secretKey_credentials, jwt } = require('./db_credentials');

async function getPrivateKey() {
    const pool = mysql.createPool(secretKey_credentials);

    try {
        const con = await pool.getConnection();
        var [rows] = await con.execute('SELECT privateKey FROM privatekey LIMIT 1');
        const privateKey = rows.length > 0 ? rows[0].privateKey : null;

        if (privateKey !== null) {
            return { success: true, data: privateKey };
        } else {
            return { success: false, message: 'No private key found', data: null };
        }
    } catch (err) {
        console.error('Error during Private Key obtaining: ', err);
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

    if (validator.isEmail(email)) {
        return { success: true };
    } else {
        return { success: false, message: 'Invalid email address' };
    }
    
}

function phoneChecker(phone) {
    var phonePattern = /^(?:(?:\+|00)40|0)\d{9}$/;

    if (phonePattern.test(phone)) {
        return { success: true };
    } else {
        return { success: false, message: 'Invalid phone number' };
    }
}

async function getId(username) {
    let pool = mysql.createPool(credentials);

    try {
        var con = await pool.getConnection();
        var [rows] = await con.execute("SELECT id FROM users WHERE username = ?", [username]);
        var returnedId = rows.length > 0 ? rows[0].id : null;

        if (returnedId !== null) {
            return { success: true, data: returnedId };
        } else {
            return { success: false, data: null };
        }
    } catch (err) {
        console.log('Error during ID obtaining: ', err);
        return { success: false, message: 'An internal error occured' };
    } finally {
        pool.end();
    }
}

async function generateToken(id, username, password) {
    const secretKey = (await getPrivateKey()).data;

    if (secretKey !== null) {
        var encryptedToken = jwt.sign({ id, username, password }, secretKey);
        
        return { success: true, data: encryptedToken };
    } else {
        console.log('Error: no secretKey found');
        return { success: false, message: 'No secret key found!' };
    }
}

function generateSecretKey() {
    return crypto.randomBytes(32).toString('hex');
}

module.exports = { getPrivateKey, passwordChecker, emailChecker, getId, generateToken, phoneChecker };
