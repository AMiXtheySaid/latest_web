const { mysql, credentials, fs, logPath } = require('./db_credentials')

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
        } else if (passwordChecker(password) === 0) {
            return { success: false, message: 'Please choose another password!' };
        } else if (emailChecker(email) === 0) {
            return { success: false, message: 'Wrong email address!' };
        } else {
            const joinDate = new Date();
            const formattedJoinDate = joinDate.toISOString().slice(0, 19).replace('T', ' ');

            await con.execute('INSERT INTO Users (username, password, email, join_date) VALUES (?, ?, ?, ?)', [username, password, email, formattedJoinDate]);
            await fs.appendFile(logPath, `${joinDate}: User ${username} successfully created\n`);
            
            return { success: true, message: 'User successfully created!' };
        }
    } catch (err) {
        console.error('Error', err);
        return { success: false, message: 'An error occurred' };
    } finally {
        pool.end();
    }
}

function passwordChecker(password) {
    if (password.length < 8) {
        console.log("Password must contain at least 8 characters!");
        return 0;
    }

    if (!/[A-Z]/.test(password)) {
        console.log("Password must contain at least 1 upper case!");
        return 0;
    }

    return 1;
}

function emailChecker(email) {
    // Implement your email checking logic here
    return 1;
}

module.exports = registerBtn;
