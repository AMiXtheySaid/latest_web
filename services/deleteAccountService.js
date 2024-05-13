const { mysql, credentials } =  require('./db_credentials');
const { getId } = require('./functions');

async function deleteAccount(username) {
    const pool = mysql.createPool(credentials);

    try {
        const con = await pool.getConnection();

        const returnedId = (await getId(username)).data;

        con.execute('DELETE FROM users WHERE id = ?', [returnedId]);
    } catch (err) {
        console.log('Error during Account Deletion: ', err);
        return { success: false, message: "An internal error occured" };
    }
}
