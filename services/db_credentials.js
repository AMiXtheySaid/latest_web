const logPath = '../logs.txt';
const mysql = require('mysql2/promise');
const fs = require('fs/promises');

const credentials = {
    host: 'localhost',
    port: 3000,
    user: 'root',
    password: '88P09PR9V',
    database: 'latest'
};

module.exports = { mysql, credentials, fs, logPath };
