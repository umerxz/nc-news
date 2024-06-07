const apiRouter = require("express").Router()
const topicsRouter = require('./topics-router')
const usersRouter = require('./users-router')
const articlesRouter = require('./articles-router')
const commentsRouter = require('./comments-router')
const { getEndpoints } = require("../controllers/topics.controllers")

apiRouter.use('/users',usersRouter)
apiRouter.use('/topics',topicsRouter)
apiRouter.use('/articles',articlesRouter)
apiRouter.use('/comments',commentsRouter)

apiRouter.get('/',getEndpoints)


module.exports = apiRouter