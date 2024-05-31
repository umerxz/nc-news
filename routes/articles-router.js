const { getArticles, getArticleCommentsById, getArticleById, patchArticleById, postArticleCommentById, postArticle, deleteArticleById } = require("../controllers/articles.controllers")
const articlesRouter = require("express").Router()

articlesRouter
    .route('/')
    .get(getArticles)
    .post(postArticle)

articlesRouter
    .route('/:article_id')
    .get(getArticleById)
    .patch(patchArticleById)
    .delete(deleteArticleById)

articlesRouter
    .route('/:article_id/comments')
    .get(getArticleCommentsById)
    .post(postArticleCommentById)

module.exports = articlesRouter