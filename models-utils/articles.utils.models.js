const db = require('../db/connection')

exports.getArticlesFilterQuery = (author, topic, queryValues) => {
    let query = '';
    if (topic) {
        if (Array.isArray(topic)) {
            const parametrics = topic.map((_, index) => `$${index + 1}`).join(', ');
            queryValues.push(...topic);
            query += ` WHERE topic IN (${parametrics})`;
        } else {
            queryValues.push(topic);
            query += ` WHERE topic = $${queryValues.length}`;
        }
    }
    if (author) {
        if (query) {
            query += ' AND';
        } else {
            query += ' WHERE';
        }
        if (Array.isArray(author)) {
            const parametrics = author.map((_, index) => `$${queryValues.length + index + 1}`).join(', ');
            queryValues.push(...author);
            query += ` articles.author IN (${parametrics})`;
        } else {
            queryValues.push(author);
            query += ` articles.author = $${queryValues.length}`;
        }
    }
    return query;
};
exports.validSortOrder = (sort_by,order) => {
    return new Promise((resolve,reject)=>{
        const validSortBy = ['created_at',"author", "topic", "votes", "comment_count"]
        const validOrder = ["ASC","DESC"]
        if(!validOrder.includes(order.toUpperCase())) return reject({status: 400, msg: 'Bad Order Request.'})
        if(!validSortBy.includes(sort_by)) return reject({status: 400, msg: 'Bad Sort Request.'})
        return resolve()
    })
}
exports.validLimit = (limit) => {
    return new Promise((resolve,reject)=>{
        if(limit<=0 || isNaN(limit)) return reject({ status: 400, msg: "Invalid Limit." })
        return resolve(limit)
    })
}
exports.validPage = (page) => {
    return new Promise((resolve,reject)=>{
        if(page<=0 || isNaN(page)) return reject({ status: 400, msg: "Invalid Page Number." })
        return resolve(page)
    })
}
exports.getTotalArticlesSqlQuery = (filter) => 'SELECT COUNT(*) AS total_count FROM articles' + filter

exports.getTotalCount = (query,values) => {
    return db.query(query,values)
    .then( ({rows})=> rows[0].total_count )
}
exports.nonExistingArticlesTopic = ( author, topic, totalArticlesCount ) => {
    return new Promise((resolve,reject)=>{
        if(totalArticlesCount===0 && author && !topic) return reject({ status:404, msg: 'User has no Articles!' })
        if(totalArticlesCount===0 && topic && !author) return reject({ status:404, msg: 'Article(s) with that Topic Not Found' })
        if(totalArticlesCount===0 && topic && author) return reject({ status:404, msg: 'Article(s) Not Found' })
        return resolve()
    })
}
exports.pageBeyondLimit = (page,totalArticlesCount,limit) => {
    return new Promise((resolve,reject)=>{
        const maxPages = Math.ceil(totalArticlesCount / limit)
        if (page > maxPages) return reject({ status: 404, msg: 'Page Not Found.' })
        return resolve()
    })
}
exports.getLimitOffsetQuery = (limit,page,queryValues) => {
    queryValues.push(limit)
    let query = ` LIMIT $${queryValues.length}`
    const offset = (page-1)*limit
    queryValues.push(offset)
    query += ` OFFSET $${(queryValues.length)};`
    return query
}
exports.getArticlesSqlQuery = (filterQuery,sort_by,order,limitOffsetQuery) => {
    let query = `SELECT 
    articles.author,
    articles.title,
    articles.article_id,
    articles.topic,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    COUNT(comments.article_id)::INT AS comment_count
    FROM articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id
    ${filterQuery}
    GROUP BY articles.article_id`
    if(sort_by==='comment_count') query+=` ORDER BY ${sort_by} ${order} ${limitOffsetQuery}`
    else query+=` ORDER BY articles.${sort_by} ${order} ${limitOffsetQuery}`
    return query
}

exports.getArticleCommentsQuery = (article_id,queryValues) => {
    let query = 'SELECT comments.* FROM articles JOIN comments ON comments.article_id = articles.article_id'
    if(article_id){
        queryValues.push(article_id)
        query += ` WHERE articles.article_id=$${queryValues.length}`
    }
    return query + ' ORDER BY comments.created_at desc'
}
exports.getTotalArticleCommentsSqlQuery = (query) => `SELECT COUNT(*) AS total_count FROM (${query});`
