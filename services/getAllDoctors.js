const { mysql, credentials } = require('./db_credentials');

async function getAllDoctors() {
    const pool = mysql.createPool(credentials);

    try {
        const con = await pool.getConnection();

        const query = `
        SELECT * FROM doctors
        `;

        const [rows] = await con.execute(query);
        const returnedData = rows.length > 0 ? rows : null;
        
        return { success: true, data: returnedData };
    } catch (err) {
        console.log("An error occured retrieving the doctors: ", err.message);
        return { success: false, message: `An error occured retrieving the doctors ${err.message}`, data: null };
    } finally {
        pool.end();
    }
}

module.exports = { getAllDoctors };