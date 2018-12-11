const PG = require('pg');
require('dotenv').config();
const dbUrl = process.env.DATABASE_URL
const pool = new PG.Pool({connectionString: dbUrl});
const bcrypt = require('bcrypt');


function checkPassword(username, password, callback){
    pool.query('SELECT password FROM player WHERE username = $1', [username], function(err, data){
        console.log(data);
        if(err)
            callback(err, {});
        else if(data.length == 1)
            bcrypt.compare(password, data.rows[0].password, callback);
        else
            callback(null, false);
    });
}

function addUser(username, password, callback){
    pool.query('SELECT id FROM player WHERE username = $1', [username], function(err, data){
        if(err){
            callback(err, {});
        }
        if(data.rows.length){
            callback("User in database", {});
        }
        bcrypt.hash(password, 10, function(err, hash){
            if(err)
                return callback(err, 0);
            pool.query('INSERT INTO player (username, password) VALUES ($1, $2) RETURNING id', [username, hash], function(err, data){
                if(err)
                    callback(err, 0)
                else if(data.rows[0])
                    callback(null, data.rows[0].id)
                else
                    callback("unknown error: no data from database", 0)
            });
        });
    });
}

module.exports = {
    checkPassword: checkPassword,
    addUser: addUser
}