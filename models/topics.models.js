const db = require('../db/connection')
const fs = require('fs/promises')
exports.fetchTopics=()=>{
    return db.query(`SELECT * FROM topics;`)
    .then((topics)=>{
        return topics.rows
    })
}

exports.invalidPaths = () => {
    return Promise.reject({ status: 404, msg: "Not Found" });
};

exports.selectEndpoints = () => {
    return fs.readFile(`${process.cwd()}/endpoints.json`,'utf-8')
    .then((endpoints)=>{
        const parsedEndpoints = JSON.parse(endpoints)
        return {endpoints:parsedEndpoints}
    })
}