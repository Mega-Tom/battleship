const PG = require('pg');
const pool = new PG.Pool();
const bcrypt = require('bcrypt');


async function checkPassword(username, password){
    var data = await pool.query('SELECT password FROM users WHERE username = $1', [username]);
    return await bcrypt.compareSync(password, data.rows[0].password);
}

module.exports = {
    checkPassword: checkPassword
}