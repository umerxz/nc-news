const db = require('../db/connection')
const format = require('pg-format')
const fs = require('fs/promises')
exports.fetchTopics=()=>{
    return db.query(`SELECT * FROM topics;`)
    .then((topics)=>{
        return topics.rows
    })
}
exports.invalidPaths = () => {
    return Promise.reject({ status: 404, msg: "Invalid Path Typed. Did you mean /api/topics ?" });
};
exports.selectEndpoints = () => {
    return fs.readFile(`${process.cwd()}/endpoints.json`,'utf-8')
    .then((endpoints)=>{
        const parsedEndpoints = JSON.parse(endpoints)
        return {endpoints:parsedEndpoints}
    })
}
exports.insertTopic = ({slug,description}) => {
    if(!isNaN(Number(slug)) || !isNaN(Number(description))){
        return Promise.reject({ status:400, msg:"Bad Request"})
    }
    return db.query(
        format(
            `INSERT INTO topics (slug,description) VALUES %L RETURNING *;`,[[slug,description]]
        )
    )
    .then(({rows})=>{
        return rows[0]
    })
}
