const { mysql, credentials } = require('./db_credentials.js');

async function getDoctors(serviceName) {
    const pool = mysql.createPool(credentials);

    if (service !== null) {
        try {
            const con = await pool.getConnection();

            query = `
            SELECT doctors.surname, doctors.name 
            FROM doctors
            JOIN doctor_service ON doctor_service.idd = doctors.id
            JOIN services ON services.id = doctor_service.ids
            WHERE services.name = ?
            `

            const [rows] = await con.execute(query, [serviceName]);

            const data = rows.forEach(row => ({
                name: row.name
            }));

            return { success: true, data: data };
        } catch (err) {
            console.error('Error during retrieving doctors ', err);
            return { success: false, message: `Error during retrieving doctors: ${err}`, data: null };
        } finally {
            pool.end();
        }
        
    } else {
        
    }
}

async function getServices(doctor) {
    const pool = mysql.createPool(credentials);

    if (doctor !== null) {
        try {
            const con = await pool.getConnection();

            query = `
            SELECT services.name
            FROM services
            JOIN doctor_service ON doctor_service.idd = doctors.id
            JOIN services ON services.id = doctor_service.ids
            WHERE doctors.surname AND doctors.name = ? 
            `

            const [rows] = await con.execute(query, [doctor.surname, doctor.name]);

            const data = rows.forEach(row => ({
                surname: row.surname,
                name: row.name
            }));

            return { success: true, data: data };
        } catch (err) {
            console.error('Error during retrieving doctors ', err);
            return { success: false, message: `Error during retrieving doctors: ${err}`, data: null };
        } finally {
            pool.end();
        }
    } else {
        
    }
}

module.exports = { getDoctors, getServices };
