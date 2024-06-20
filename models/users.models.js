const db = require('../db/connection')
const format = require('pg-format')

exports.fetchUsers = () => {
    return db.query(`SELECT * FROM users;`)
    .then( ({rows})=> rows )
}
exports.fetchUserByUsername = (username) => {
    
    if(!(/^[a-zA-Z][a-zA-Z0-9._]*[a-zA-Z0-9]$/.test(username) && !/^[0-9._]+$/.test(username))){
        return Promise.reject({ status:400, msg:"Bad Request. Incorrect Username Format." })
    }
    return db.query(
        `SELECT * FROM users WHERE username = $1`, [username]
    )
    .then(({rows})=>{
        if(!rows.length){
            return Promise.reject({ status:404, msg:"User Not Found." })
        }
        return rows[0]
    })
}
exports.addUser = ({username,name,avatar_url}) => {
    if (username.length >= 6 && username.length <= 15 && /^[a-zA-Z][a-zA-Z0-9._]*[a-zA-Z0-9]$/.test(username) && !/^[0-9._]+$/.test(username)) {
        return db.query(
            format(
                `INSERT INTO users (username,name,avatar_url) VALUES %L RETURNING *;`,[[username,name,avatar_url]]
            )
        )
        .then( ({rows})=> rows[0] )
    }
    return Promise.reject({ status:400, msg:"Incorrect Username Format." })
}