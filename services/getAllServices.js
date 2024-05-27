const { mysql, credentials } = require('./db_credentials');

async function getAllServices() {
    const pool = mysql.createPool(credentials);

    try {
        const con = await pool.getConnection();

        const query = `
        SELECT s.name, s.price, s.duration, s.url, 
        GROUP_CONCAT(DISTINCT d.name ORDER BY d.name SEPARATOR ', ') AS doctors
        FROM services s
        JOIN doctor_service ds ON ds.ids = s.id
        JOIN doctors d ON d.id = ds.idd
        GROUP BY 
        s.name, s.price, s.duration, s.url
        `;

        const [rows] = await con.execute(query);
        const returnedInfo = rows.length > 0 ? rows : null;

        return { success: true, data: returnedInfo };
    } catch (err) {
        console.log("There was an error retrieving all the services: ", err.message);
        return { success: false, message: `There was an error retrieving all the services: ${err.message}` };
    } finally {
        pool.end();
    }
}

module.exports = { getAllServices };