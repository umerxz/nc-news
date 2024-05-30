const db = require('../db/connection')
exports.checkUsersExists = (username) => {
    return db.query(
        `SELECT * FROM users WHERE username = $1`, [username]
    )
    .then((results)=>{
        if(!results.rows.length){
            return Promise.reject({ status: 404, msg: "Not Found" })
        }
    })
}