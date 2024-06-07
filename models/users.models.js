const db = require('../db/connection')

exports.fetchUsers = () => {
    return db.query(`SELECT * FROM users;`)
    .then(({rows})=>{
        return rows
    })
}
exports.fetchUserByUsername = (username) => {
    
    if(!(/^[a-zA-Z][a-zA-Z0-9._]*[a-zA-Z0-9]$/.test(username) && !/^[0-9._]+$/.test(username))){
        return Promise.reject({ status:400, msg:"Bad Request" })
    }
    return db.query(
        `SELECT * FROM users WHERE username = $1`, [username]
    )
    .then(({rows})=>{
        if(!rows.length){
            return Promise.reject({ status:404, msg:"Not Found" })
        }
        return rows[0]
    })
}