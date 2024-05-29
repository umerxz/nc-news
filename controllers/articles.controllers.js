const { fetchArticleById, fetchArticles, fetchArticleCommentsById, checkArticleExists } = require("../models/articles.models")

exports.getArticleById = (req, res, next) => {
    fetchArticleById(req.params.article_id)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch(next);
}
exports.getArticles = (req, res, next) => {
    fetchArticles()
    .then((articles) => {
        res.status(200).send({articles})
    }).catch(next);
}
exports.getArticleCommentsById = (req, res, next) => {
    const article_id=req.params.article_id
    const promises = [fetchArticleCommentsById(article_id)]
    
    promises.push(checkArticleExists(article_id))
    
    Promise.all(promises)
    .then((resolvedPromises)=>{
        res.status(200).send({comments:resolvedPromises[0]})
    })
    .catch(next)
}