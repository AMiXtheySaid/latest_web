const { mysql, credentials } = require('./db_credentials');
const { getId } = require('./functions');

async function getPastAppointments(user) {
    const pool = mysql.createPool(credentials);
    
    try {
        const con = await pool.getConnection();
        const userId = (await getId(user)).data;

        const query = `
        SELECT * FROM appointments
        WHERE idu = ?
        `;

        const [rows] = await con.execute(query, [userId]);

        const pastAppointments = rows.length > 0 ? rows : null;
        return { success: true, data: pastAppointments };
    } catch (err) {
        console.log("There was an error retrieving the past appointments: ", err.message);
        return { success: false, message: "An error occured retrieving past appointments" };
    } finally {
        pool.end();
    }
}

module.exports = { getPastAppointments };
