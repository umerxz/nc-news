const { updateArticleById } = require("../models/articles.models");
const { fetchArticleById, fetchArticles, fetchArticleCommentsById, checkArticleExists, insertArticleCommentById } = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
    fetchArticleById(req.params.article_id)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch(next);
}
exports.getArticles = (req, res, next) => {
    fetchArticles(req.query)
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
exports.postArticleCommentById = (req, res, next) => {
    const article_id=req.params.article_id
    const {username,body}=req.body

    return insertArticleCommentById(article_id,username,body)
    .then((newComment)=>{
        res.status(201).send({comment:newComment})
    })
    .catch(next)
}
exports.patchArticleById = (req, res, next) =>{
    const newVotes =  req.body.inc_votes
    const article_id = req.params.article_id
    return updateArticleById(article_id,newVotes)
    .then((article) => {
        res.status(200).send({article})
    }).catch(next);
}