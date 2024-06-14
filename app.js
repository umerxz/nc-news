const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require("./error-handlers/error-handler");
const { invalidRoutes } = require("./controllers/invalid-routes.controllers");
const express = require("express");
const apiRouter = require('./routes/api-router');

const app = express();
app.use(express.json())

app.use('/api',apiRouter)
app.get('*',invalidRoutes)

app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleServerErrors)

module.exports=app