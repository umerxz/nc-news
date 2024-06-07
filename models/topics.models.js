const db = require('../db/connection')

exports.fetchTopics=()=>{
    return db.query(`SELECT * FROM topics;`)
    .then((topics)=>{
        return topics.rows
    })
}

exports.invalidPaths = () => {
    return Promise.reject({ status: 404, msg: "Invalid Path Typed. Did you mean /api/topics ?" });
};