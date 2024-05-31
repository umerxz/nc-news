const { fetchTopics, invalidPaths, selectEndpoints, insertTopic } = require("../models/topics.models")

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
exports.postTopic =  (req, res, next) => {
    insertTopic(req.body)
    .then((topic)=>{
        res.status(201).send({topic})
    })
    .catch(next)
}