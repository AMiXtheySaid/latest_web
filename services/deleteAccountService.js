const { mysql, credentials } =  require('./db_credentials');
const { getId } = require('./functions');

async function deleteAccount(username) {
    const pool = mysql.createPool(credentials);

    try {
        const con = await pool.getConnection();
        const returnedId = (await getId(username)).data;

        await con.query('DELETE FROM users WHERE id = ?', [returnedId]);

        return { success: true, message: 'User successfully deleted' };
    } catch (err) {
        console.log('Error during Account Deletion: ', err);
        return { success: false, message: "An internal error occured" };
    } finally {
        pool.end();
    }
}

module.exports = { deleteAccount };
