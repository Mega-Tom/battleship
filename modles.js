const PG = require('pg');
const dbUrl = process.env.DATABASE_URL
const pool = new PG.Pool({connectionString: dbUrl});
const bcrypt = require('bcrypt');


function checkPassword(username, password, callback){
    var data = pool.query('SELECT password FROM users WHERE username = $1', [username], function(err, data){
        if(err)
            callback(err, {});
        else
            bcrypt.compare(password, data.rows[0].password, callback);
    });
}

function addUser(username, password, callback){
    pool.query('SELECT id FROM users WHERE username = $1', [username], function(err, data){
        if(err){
            callback(err, {});
        }
        if(data.rows.length){
            callback("User in database", {});
        }
        bcrypt.hash(password, 10, function(hash){
            pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id', [username, hash], function(err, data){
                callback(err, err ? 0, data.rows[0].id)
            });
        });
    });
}

module.exports = {
    checkPassword: checkPassword
}