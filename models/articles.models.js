const db = require('../db/connection')

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
exports.fetchArticles = (sort_by='created_at',order='desc') => {
    let query = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.votes, articles.created_at, COUNT(comments.article_id)::INT AS comment_count FROM articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id`
    
    const validSortBy = ['created_at']
    if(!validSortBy.includes(sort_by) && sort_by){
        return Promise.reject({status: 400, msg: 'Bad Request'})
    }
    
    query += ` ORDER BY articles.${sort_by} ${order.toUpperCase()};`
    
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