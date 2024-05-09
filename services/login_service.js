const { mysql, credentials, jwt } = require('./db_credentials.js');
const { generateToken } = require('./functions.js');

async function signinBtn(username, password) {
    const pool = mysql.createPool(credentials);

    try {
        const con = await pool.getConnection();
        const [rows] = await con.execute("SELECT id, password FROM users WHERE username = ?", [username]);
        const returnedId = rows.length > 0 ? rows[0].id : null;

        if (returnedId !== null) {
            const returnedPassword = rows.length > 0 ? rows[0].password : null;

            if (returnedPassword === password) {
                const token = (await generateToken(returnedId, username, password)).data;

                return { success: true, message: "Successfully connected!", data: token };
            } else {
                return { success: false, message: 'Incorrect username or password!' };
            }
        } else {
            return { success: false, message: 'Incorrect username or password!' };
        }
    } catch (err) {
        console.error('Error during Login: ', err);
        return { success: false, message: 'An internal error occured' };
    } finally {
        pool.end();
    }
}

module.exports = { signinBtn };
