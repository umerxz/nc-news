const { fetchTopics, invalidPaths, selectEndpoints } = require("../models/topics.models")


exports.getTopics=(req,res,next)=>{
    fetchTopics()
    .then((topics) => res.status(200).send({topics}))
    .catch((err) => {
        next(err)
    });
}

exports.invalidRoutes = (req, res, next) => {
    invalidPaths()
    .catch(next);
};

exports.getEndpoints = (req, res, next) => {
    selectEndpoints()
    .then((endpoints)=>{
        res.status(200).send(endpoints)
    })
}