const express = require("express");
const { getTopics, invalidRoutes, getEndpoints } = require("./controllers/topics.controllers");
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require("./error-handlers/error-handler");
const { getArticleById, getArticles, getArticleCommentsById, postArticleCommentById, patchArticleById } = require("./controllers/articles.controllers");
const { deleteCommentById } = require("./controllers/comments.controllers");

const app = express();
app.use(express.json())

app.get('/api/topics',getTopics)
app.get('/api',getEndpoints)
app.get('/api/articles/:article_id',getArticleById)
app.get('/api/articles',getArticles)
app.get('/api/articles/:article_id/comments',getArticleCommentsById)
app.post('/api/articles/:article_id/comments',postArticleCommentById)
app.patch('/api/articles/:article_id',patchArticleById)
app.delete('/api/comments/:comment_id',deleteCommentById)

app.get('*',invalidRoutes)

app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleServerErrors)

module.exports=app