const { mysql, credentials, fs, logPath } = require('./db_credentials');
const { passwordChecker, emailChecker, getId, phoneChecker } = require('./functions');

async function registerBtn(username, password, email, phone) {  
    const pool = mysql.createPool(credentials);

    try {
        const con = await pool.getConnection();
        var returnedId = (await getId(username)).data;

        if (returnedId !== null) {
            return { success: false, message: 'Username already taken!' };
        } else if (username.length < 4) {
            return { success: false, message: 'Username must contain at least 4 characters!' };
        } else {
            const passwordValidation = passwordChecker(password);
            const emailValidation = emailChecker(email);

            if (!phoneChecker(phone).success) {
                return { success: false, message: phoneChecker(phone).message };
            } else if (!passwordValidation.success) {
                return { success: false, message: passwordValidation.message };
            } else if (!emailValidation.success) {
                return { success: false, message: emailValidation.message };
            }

            const joinDate = new Date();
            const formattedJoinDate = joinDate.toISOString().slice(0, 19).replace('T', ' ');
            await con.execute('INSERT INTO Users (username, password, email, join_date, phone) VALUES (?, ?, ?, ?, ?)', [username, password, email, formattedJoinDate, phone]);
            await fs.appendFile(logPath, `${joinDate}: User ${username} successfully created\n`);

            return { success: true, message: 'User successfully created!' }; 
        }
    } catch (err) {
        console.error('Error during Registering: ', err);
        return { success: false, message: 'An error occurred' };
    } finally {
        pool.end();
    }
}

module.exports = { registerBtn };
