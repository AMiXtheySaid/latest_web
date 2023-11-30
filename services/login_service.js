const mysql = require('mysql2');
const fs = require('fs');

const con = mysql.createConnection({
    host: 'localhost',
    port: 3000,
    user: 'root',
    password: '88P09PR9V',
    database:'latest'
})

async function signinBtn(username, password) {
    con.connect((err) => {
        if (err) {
            console.error('Error connecting to the database', err);
                return;
        }

        var returned_id = 0;

        con.query('SELECT (id, password) FROM Users WHERE username = ?', username, (err, rows) => {
            if (err) {
                console.log('Error executing SELECT query', err.message);
                return;
            }
            
            returned_id = rows.length > 0 ? rows[0].id : null;
            if (returned_id !== 0) { // there exists such a user
                const returned_password = rows.length > 0 ? rows[0].password : null;

                if (returned_password === password) { 
                    // allow
                    const login_date = new Date();

                    fs.appendFile(logPath, `${login_date}: User ${username} successfully logged in\n`, (err) => {
                        if (err) {
                            throw err;
                        }
                        else {
                        console.log(`${username} successfully logged in`);
                        }
                    })

                    alert("Successfully connected!");
                }
                else {
                    alert("Wrong username or password!");
                }
            }
            else {
                alert("Wrong username or password!");
            }
           
        })

        con.end();
    })
}

export default signinBtn;
