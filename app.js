const express = require("express");
const { getTopics, invalidRoutes } = require("./controllers/topics.controllers");
const { handleCustomErrors, handleServerErrors } = require("./error-handlers/error-handler");

const app = express();

app.get('/api/topics',getTopics)
app.get('*',invalidRoutes)

app.use(handleCustomErrors)
app.use(handleServerErrors)

module.exports=app