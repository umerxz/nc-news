const db = require('../db/connection')
const format = require('pg-format')
exports.fetchArticleById = (id) =>{
    return db.query(
        `SELECT * FROM articles WHERE article_id = $1;`,[id]
    )
    .then((result)=>{
        if(result.rows.length===0){
            return Promise.reject({
                status:404,
                msg: 'Not Found'
            })
        }
        return result.rows[0]
    })
}
exports.fetchArticles = (sort_by='created_at',order='DESC') => {
    let query = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.votes, articles.created_at, COUNT(comments.article_id)::INT AS comment_count FROM articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id`
    
    query += ` ORDER BY articles.${sort_by} ${order};`
    
    return db.query(query)
    .then((results)=>{
        return results.rows
    })
}
exports.checkArticleExists = (id) => {
    return db.query(
        `SELECT * FROM articles WHERE article_id = $1`, [id]
    )
    .then((results)=>{
        if(!results.rows.length){
            return Promise.reject({ status: 404, msg: "Not Found" })
        }
    })
}
exports.fetchArticleCommentsById = (id) => {
    return db.query(
        `select comments.*
        from articles
        join comments on comments.article_id = articles.article_id
        where articles.article_id=$1
        order by comments.created_at desc`,[id]
    )
    .then((results) => {
        return (results.rows)
    });
}
exports.insertArticleCommentById = (id,username,body) => {
    if(!id || !username || !body){
        return Promise.reject({ status:400, msg: "Bad Request"})
    }
    const formattedComment = [[Number(id),username,body]]
    return db.query(
        format(
            `INSERT INTO comments (article_id,author,body) VALUES %L
            RETURNING*;`,formattedComment
        )
    )
    .then((results)=>{
        return results.rows[0]
    })
}
exports.updateArticleById = (article_id,newVotes) => {
    return db.query(
        `UPDATE articles SET votes = votes+$1 WHERE article_id = $2 RETURNING *;`,[newVotes,article_id]
    )
    .then(({rows})=>{
        if(!rows.length){
            return Promise.reject({ status:404, msg:"Not Found" })
        }
        return rows[0]
    })
}