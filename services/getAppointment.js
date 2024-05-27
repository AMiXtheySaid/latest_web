const { mysql, credentials } = require('./db_credentials');
const { decryptToken } = require('./validateCredentials');
const { getId, getDoctorId, getServiceId } = require('./functions');

async function checkDoctorSpecialization(doctor, service) {
    const pool = mysql.createPool(credentials);

    try {
        const query = `
            SELECT COUNT(*) AS COUNT
            FROM doctors d
            JOIN doctor_service ds ON d.id = ds.idd
            JOIN services s ON ds.ids = s.id
            WHERE d.name = ? AND s.name = ?;
        `;

        const [rows] = await pool.execute(query, [doctor, service]);
        const appointmentCount = rows[0].appointment_count;

        if (appointmentCount >= 3) {
            return { success: false, message: `Doctor doesn't have the proper specialization` };
        } else {
            return { success: true, message: 'Ok' };
        }
    } catch (err) {
        console.error("Error getting the specialization:", err.message);
        return { success: false, message: 'Error getting the specialization' };
    }
}

async function checkDoctorAvailability(doctor, date) {
    const pool = mysql.createPool(credentials);

    try {
        const query = `
            SELECT COUNT(*) AS appointment_count
            FROM appointments
            JOIN doctors ON appointments.idd = doctors.id
            WHERE doctors.name = ? AND DATE(appointments.date) = ?;
        `;

        const [rows] = await pool.execute(query, [doctor, date]);
        const appointmentCount = rows[0].appointment_count;

        if (appointmentCount >= 3) {
            return { success: false, message: 'Doctor has reached the maximum number of appointments for that day' };
        } else {
            return { success: true, message: 'Ok' };
        }
    } catch (err) {
        console.error("Error getting the availability:", err.message);
        return { success: false, message: 'Error getting the availability' };
    }
}

async function getAppointment(token, service, doctor, date) {
    const pool = mysql.createPool(credentials);

    try {
        const user = (await decryptToken(token)).data.username;
        const userId = (await getId(user)).data;
        const doctorId = (await getDoctorId(doctor)).data;
        const serviceId = (await getServiceId(service)).data;

        const doctorAvailable = await checkDoctorAvailability(doctor, date);
        const doctorSpecialized = await checkDoctorSpecialization(doctor, service);

        if (doctorAvailable.success && doctorSpecialized.success) {

            const query = `
                INSERT INTO appointments (date, idu, idd, ids)
                VALUES (?, ?, ?, ?);
            `;

            await pool.execute(query, [date, userId, doctorId, serviceId]);
            return { success: true };
        } else {
            return { success: false, message: doctorAvailable.message || doctorSpecialized.message };
        }
    } catch (err) {
        console.error('Error creating an appointment:', err.message);
        return { success: false, message: `Error creating an appointment: ${err.message}` };
    } finally {
        pool.end();
    }
}

module.exports = { getAppointment };
