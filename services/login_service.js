const { mysql, credentials, fs, logPath } = require('./db_credentials.js');

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
                return { success: true, message: "Successfully connected!"};
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

function rand() {
    return Math.random().toString(36).substring(2);
}

async function tokenGen() {
    var part1 = rand();
    var part2 = rand();
    return part1 + part2;
}

module.exports = { signinBtn, tokenGen };
