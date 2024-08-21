const db = require('../db/connection')
const format = require('pg-format')
const fs = require('fs/promises')
const { getTotalCount, validSortOrder, validLimit, validPage, getArticlesFilterQuery, getTotalArticlesSqlQuery, getArticlesSqlQuery, getLimitOffsetQuery, nonExistingArticlesTopic, pageBeyondLimit, getArticleCommentsQuery, getTotalArticleCommentsSqlQuery } = require('../models-utils/articles.utils.models')

exports.fetchArticleById = (id) =>{
    return db.query(
        `SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count FROM articles 
        LEFT JOIN comments ON comments.article_id = articles.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id`,[id]
    )
    .then((result)=>{
        if(result.rows.length===0){
            return Promise.reject({ status:404, msg: 'Article Not Found.' })
        }
        return result.rows[0]
    })
}
exports.fetchArticles = ({author,topic,sort_by='created_at',order='DESC',limit=10,p=1}) => {
    const queryValues=[]
    const filterQuery = getArticlesFilterQuery(author,topic,queryValues)
    let totalArticlesCount
    limit=Number(limit)
    page=Number(p)
    return validSortOrder(sort_by,order)
    .then( ()=> validLimit(limit) )
    .then( (limit)=> validPage(page) )
    .then( (page)=> getTotalCount(getTotalArticlesSqlQuery(filterQuery),queryValues) )
    .then( (totalArticles)=>{
        totalArticlesCount= +totalArticles
        return nonExistingArticlesTopic(author,topic,totalArticlesCount)
    })
    .then(()=>{
        return pageBeyondLimit(page,totalArticlesCount,limit)
    })
    .then(() => {
        const limitOffsetQuery = getLimitOffsetQuery(limit, page, queryValues);
        const query = getArticlesSqlQuery(filterQuery, sort_by, order, limitOffsetQuery);
        return db.query(query, queryValues);
    })
    .then((results) => {
        return { articles: results.rows, total_count: totalArticlesCount };
    })
}
exports.checkArticleExists = ({article_id}) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((results)=>{
        if(!results.rows.length){
            return Promise.reject({ status: 404, msg: "Article Not Found." })
        }
    })
}
exports.fetchArticleCommentsById = ({ article_id }, { limit = 10, p = 1 }) => {
    limit = Number(limit)
    p = Number(p)

    if (limit <= 0 || isNaN(limit)) {
        return Promise.reject({ status: 400, msg: "Invalid Limit." })
    }
    if (p <= 0 || isNaN(p)) {
        return Promise.reject({ status: 400, msg: "Invalid Page Number." })
    }

    const countQuery = 'SELECT COUNT(*) as total_count FROM comments WHERE article_id = $1'
    return db.query(countQuery, [article_id])
    .then(({ rows }) => {
        const totalCount = parseInt(rows[0].total_count, 10)
        const maxPages = Math.ceil(totalCount / limit)

        if (totalCount === 0) {
            return { comments: [], total_count: 0 }
        }
        
        if (p > maxPages) {
            return Promise.reject({ status: 404, msg: 'Page Not Found.' })
        }

        let query = `SELECT comments.* FROM comments WHERE article_id = $1
                    ORDER BY comments.created_at DESC LIMIT $2 OFFSET $3`
        const offset = (p - 1) * limit;
        return db.query(query, [article_id, limit, offset])
        .then(({ rows }) => {
            return { comments: rows, total_count: totalCount }
        })
    })
}
exports.insertArticleCommentById = (id,username,body) => {
    if(!id || !username || !body){
        return Promise.reject({ status:400, msg: "Missing Required Fields."})
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
            return Promise.reject({ status:404, msg:"Article Not Found." })
        }
        return rows[0]
    })
}
exports.insertArticle = ({author,title,body,topic,article_img_url}) => {
    const values = [author,title,body,topic]
    const identifiers = ['author','title','body','topic']
    if(article_img_url){
        values.push(article_img_url)
        identifiers.push('article_img_url')
    }
    return db.query(
        format(
            `INSERT INTO articles (%I) VALUES (%L) RETURNING *;`,identifiers,values
        )
    )
    .then(({rows})=>{
        return rows[0]
    })
}
exports.removeArticleById = ({article_id}) => {
    return db.query(
        `DELETE FROM articles WHERE article_id = $1 RETURNING *;`,[article_id]
    )
    .then(({rows})=>{
        if(!rows.length){
            return Promise.reject({ status:404, msg:"Not Found" })
        }
    })
}