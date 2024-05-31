const { removeCommentById, updateCommentById } = require("../models/comments.models")

exports.deleteCommentById = (req, res, next) => {
    const comment_id = req.params.comment_id
    removeCommentById(comment_id)
    .then((results)=>{
        res.status(204).send()
    })
    .catch(next)
}
exports.patchCommentById = (req, res, next) => {
    updateCommentById(req.params,req.body)
    .then((comment)=>{
        res.status(200).send({comment})
    })
    .catch((err)=>{
        next(err)
    })
}