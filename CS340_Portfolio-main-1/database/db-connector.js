// Citation for the following code
// Date: 5/21/23
// Adapted from CS 340 Node JS Starter Code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app


// ./database/db-connector.js

// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_gruezop',
    password        : '2389',
    database        : 'cs340_gruezop',
    dateStrings     : true
})

// Export it for use in our applicaiton
module.exports.pool = pool;