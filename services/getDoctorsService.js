const { mysql, credentials } = require('./db_credentials.js');

async function getDoctors(serviceName) {
    const pool = mysql.createPool(credentials);
    let con;

    try {
        con = await pool.getConnection();

        let query;
        let rows;

        if (serviceName) {
            // Service selected
            query = `
                SELECT doctors.name 
                FROM doctors
                JOIN doctor_service ON doctor_service.idd = doctors.id
                JOIN services ON services.id = doctor_service.ids
                WHERE services.name = ?
            `;
            [rows] = await con.execute(query, [serviceName]);
        } else {
            // No service selected
            query = `
                SELECT DISTINCT doctors.name 
                FROM doctors
            `;
            [rows] = await con.execute(query);
        }

        const returnedDoctors = rows.length > 0 ? rows : null

        return { success: true, data: returnedDoctors };
    } catch (err) {
        console.error('Error during retrieving doctors:', err);
        return { success: false, message: `Error during retrieving doctors: ${err}`, data: null };
    } finally {
        pool.end();
    }
}

module.exports = { getDoctors };
