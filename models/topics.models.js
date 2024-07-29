const db = require('../db/connection')
const format = require('pg-format')
const fs = require('fs/promises')

exports.fetchTopics=()=>{
    return db.query(`SELECT * FROM topics;`)
    .then( (topics)=> topics.rows )
}
exports.selectEndpoints = () => {
    return fs.readFile(`${process.cwd()}/endpoints.json`,'utf-8')
    .then((endpoints)=>{
        const parsedEndpoints = JSON.parse(endpoints)
        return {endpoints:parsedEndpoints}
    })
}
exports.insertTopic = ({slug,description}) => {
    if (!slug) {
        return Promise.reject({ status: 400, msg: "Missing Information." });
    }
    if(typeof slug === 'number' || typeof description === 'number'){
        return Promise.reject({ status:400, msg:"Only Numbers not Allowed!"})
    }
    return db.query(
        format(
            `INSERT INTO topics (slug,description) VALUES %L RETURNING *;`,[[slug,description]]
        )
    )
    .then( ({rows})=> rows[0] )
}
