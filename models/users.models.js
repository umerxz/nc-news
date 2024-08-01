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
exports.updateUser = ({username, name, avatar_url}) => {
    return db.query(
        `UPDATE users
        SET name = $1, avatar_url = $2
        WHERE username = $3
        RETURNING *;`,
        [name, avatar_url, username]
    )
    .then(({rows})=>{
        if(!rows.length){
            return Promise.reject({ status:404, msg:"User Not Found" })
        }
        return rows[0]
    })
}
exports.removeUserComments = (username) => {
    return db.query(`
        DELETE FROM comments
        WHERE author = $1;
    `, [username]);
};

exports.removeUserArticles = (username) => {
    return db.query(`
        DELETE FROM articles
        WHERE author = $1;
    `, [username]);
};

exports.removeUser = (username) => {
    return db.query(`
        DELETE FROM users
        WHERE username = $1;
    `, [username]);
};