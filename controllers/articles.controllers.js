const { fetchArticleById, fetchArticles, 
    fetchArticleCommentsById, checkArticleExists, 
    insertArticleCommentById, updateArticleById, 
    insertArticle, 
    removeArticleById} = require("../models/articles.models");
const { removeCommentByArticleId } = require("../models/comments.models");

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
        res.status(200).send(articles)
    })
    .catch(next);
}
exports.getArticleCommentsById = (req, res, next) => {
    const promises = [fetchArticleCommentsById(req.params,req.query)]
    
    promises.push(checkArticleExists(req.params,req.query))
    
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
exports.postArticle = (req, res, next) => {
    insertArticle(req.body)
    .then((article)=>{
        return fetchArticleById(article.article_id)
    })
    .then((article)=>{
        res.status(201).send({article})
    })
    .catch(next)
}
exports.deleteArticleById = (req, res, next) => {

    const promises = [removeCommentByArticleId(req.params),removeArticleById(req.params)]
    
    Promise.all(promises)
    .then((resolvedPromises)=>{
        console.log("<<<<<")
        res.status(204).send()
    })
    .catch(next)
}