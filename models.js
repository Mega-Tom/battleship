const PG = require('pg');
require('dotenv').config();
const dbUrl = process.env.DATABASE_URL
const pool = new PG.Pool({connectionString: dbUrl});
const bcrypt = require('bcrypt');


function checkPassword(username, password, callback){
    pool.query('SELECT password, id FROM player WHERE username = $1', [username], function(err, data){
        console.log(data);
        if(err)
            callback(err, {correct: false});
        else if(data.rows.length == 1)
            bcrypt.compare(password, data.rows[0].password, function(err, match){
                callback(err, {correct: match, id: data.rows[0].id})
            });
        else
            callback(null, {correct: false, error: "user not found"});
    });
}

function addUser(username, password, callback){
    pool.query('SELECT id FROM player WHERE username = $1', [username], function(err, data){
        if(err){
            return callback(err, {});
        }
        if(data.rows.length){
            return callback("User in database", {});
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

function getUserInfo(id, callback){
    pool.query('SELECT username FROM player WHERE id = $1', [id], function(err, data){
        if(err){
            callback(err, {});
        }
        else if(data.rows.length == 0){
            callback({error: "User not in database"}, {});
        }
        else{
            callback(null, data.rows[0]);
        }
    });
}

module.exports = {
    checkPassword: checkPassword,
    addUser: addUser,
    getUserInfo: getUserInfo
}