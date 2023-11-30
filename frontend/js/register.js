const mysql = require('mysql');
const fs = require('fs');
const logPath = '../../logs.txt';



async function registerBtn() {
    var username = document.getElementById('reg_usernameBox').value;
    var password = document.getElementById('reg_passwordBox').value;
    var email = document.getElementById('reg_emailBox').value;
    let join_date = new Date();
    var ok = 0;

    let formattedJoinDate = join_date.toISOString().slice(0, 19).replace("T", " ");

    while (username.length < 4 && passwordChecker(password) == 0 && emailChecker(email) == 0) {
        if (username.length < 4) {
            alert("Username must contain at least 4 characters!");
            return;
        }
        else if (passwordChecker === 0) {
            alert("The given PASSWORD is not allowed");
            return;
        }
        else if (emailChecker === 0) {
            alert("Wrong email");
            return;
        }
    }

    ok = 1;

    if (ok === 1) {
        const con = mysql.createConnection({
            host: 'localhost',
            port: 3000,
            user: 'root',
            password: '88P09PR9V',
            database:'latest'
        });
    
        con.connect((err) => {
            if (err) {
                console.error('Error connecting to the database', err);
                return;
            }
    
            con.query("INSERT INTO Users (username, password, email, join_date) VALUES (?, ?, ?, ?)",
            [username, password, email, formattedJoinDate], (err) => {
                if (err) {
                    return;
                }
                fs.appendFile(logPath, `${join_date}: User ${username} successfully added\n`, (err) => {
                    if (err) {
                        throw err;
                    }
                    else {
                        console.log(`User ${username} successfully added`);
                    }
                });
                
            })
    
            con.end();
        })
    
        alert(`Successfully registered!`);
    }
    
}

function passwordChecker(password) {
    if (password.length < 7) {
        alert("Password must contain at least 8 characters!");
        return 0;
    }

    if (!/[A-Z]/.test(password)) {
        alert("Password must contain at least 1 upper case!");
        return 0;
    }

    return 1;
}

function emailChecker(email) {
    return 1;
}
