const logPath = '../logs.txt';
const mysql = require('mysql2/promise');
const fs = require('fs/promises');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const credentials = {
    host: 'localhost',
    port: 3000,
    user: 'root',
    password: '88P09PR9V',
    database: 'latest'
};

const secretKey_credentials = {
    host: 'localhost',
    port: 3000,
    user: 'root',
    password: '88P09PR9V',
    database: 'secretKey'
}

module.exports = { mysql, credentials, fs, logPath, validator, jwt, secretKey_credentials };
