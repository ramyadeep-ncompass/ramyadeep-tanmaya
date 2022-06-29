const mysql = require('mysql2');

require('dotenv').config();

// create the connection to database
const mySqlConn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

const runQuery = (query, params, callback) => {
    mySqlConn.query(query, params, callback);
}

const runQueryAsync = async(query, params) => {
    return new Promise((resolve) => {
        mySqlConn.query(query, params, (error, result) => {
            if (error)
                resolve({ error });
            else
                resolve({ result })
        });
    })
}

module.exports = { runQuery, runQueryAsync }

// const config = require('config');
// const dbConfig = config.get('db_config');

// module.exports.mySqlConn = mysql.createConnection({
//     host: dbConfig.db_host,
//     user: dbConfig.db_user,
//     password: dbConfig.db_password,
//     database: dbConfig.db_database
// });