const { mysql, credentials, fs, logPath, validator, secretKey_credentials } = require('./db_credentials');
const crypto = require('crypto');

async function registerBtn(username, password, email) {
    const pool = mysql.createPool(credentials);

    try {
        const con = await pool.getConnection();
        const [rows] = await con.query('SELECT id FROM users WHERE username = ?', [username]);
        const returnedId = rows.length > 0 ? rows[0].id : null;

        if (returnedId !== null) {
            return { success: false, message: 'Username already taken!' };
        } else if (username.length < 4) {
            return { success: false, message: 'Username must contain at least 4 characters!' };
        } else {
            const passwordValidation = await passwordChecker(password);
            const emailValidation = await emailChecker(email);

            if (!passwordValidation.success) {
                return passwordValidation;
            }
            else if (!emailValidation.success) {
                return emailValidation;
            }

            const joinDate = new Date();
            const formattedJoinDate = joinDate.toISOString().slice(0, 19).replace('T', ' ');
            await con.execute('INSERT INTO Users (username, password, email, join_date) VALUES (?, ?, ?, ?)', [username, password, email, formattedJoinDate]);
            await fs.appendFile(logPath, `${joinDate}: User ${username} successfully created\n`);

            return { success: true, message: 'User successfully created!' }; 
        }
    } catch (err) {
        console.error('Error: ', err);
        return { success: false, message: 'An error occurred' };
    } finally {
        pool.end();
    }
}

async function generateSecretKey() {
    return crypto.randomBytes(32).toString('hex');
}

async function storeSecretKey(username) {
    const secretKey = await generateSecretKey();
    const returnedId = (await getId(username)).data;

    const pool = mysql.createPool(secretKey_credentials);

    try {
        const con = await pool.getConnection();
        await con.execute('INSERT INTO secretkey (value, owner_id) VALUES (?, ?)', [secretKey, returnedId]);
        return { success: true, message: 'Secret key successfully stored' };
    } catch (err) {
        console.log('Error: ', err);
        return { success: false, message: 'An internal error occured' };
    } finally {
        pool.end();
    }
}

async function passwordChecker(password) {
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

async function emailChecker(email) {
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

module.exports = { registerBtn, storeSecretKey };
