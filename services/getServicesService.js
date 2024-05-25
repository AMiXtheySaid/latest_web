const { mysql, credentials } = require('./db_credentials.js');

async function getServices(doctorName) {
    const pool = mysql.createPool(credentials);

    let con;

    try {
        con = await pool.getConnection();

        let query;
        let rows;

        if (doctorName) {
            // Doctor selected
            query = `
                SELECT services.name
                FROM services
                JOIN doctor_service ON doctor_service.ids = services.id
                JOIN doctors ON doctors.id = doctor_service.idd
                WHERE doctors.name = ?
            `;
            [rows] = await con.execute(query, [doctorName]);
        } else {
            // No doctor selected
            query = `
                SELECT DISTINCT services.name
                FROM services
            `;
            [rows] = await con.execute(query);
        }

        const servicesReturned = rows.length > 0 ? rows : null

        return { success: true, data: servicesReturned };
    } catch (err) {
        console.error('Error during retrieving services:', err);
        return { success: false, message: `Error during retrieving services: ${err}`, data: null };
    } finally {
        pool.end();
    }
}

module.exports = { getServices };
