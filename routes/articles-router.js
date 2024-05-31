const { getArticles, getArticleCommentsById, getArticleById, patchArticleById, postArticleCommentById, postArticle } = require("../controllers/articles.controllers")
const articlesRouter = require("express").Router()

articlesRouter
    .route('/')
    .get(getArticles)

articlesRouter
    .route('/:article_id')
    .get(getArticleById)
    .patch(patchArticleById)

articlesRouter
    .route('/:article_id/comments')
    .get(getArticleCommentsById)
    .post(postArticleCommentById)

module.exports = articlesRouter