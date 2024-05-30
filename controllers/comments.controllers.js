const { removeCommentById } = require("../models/comments.models")

exports.deleteCommentById = (req, res, next) => {
    const comment_id = req.params.comment_id
    removeCommentById(comment_id)
    .then((results)=>{
        res.status(204).send()
    })
    .catch(next)
}