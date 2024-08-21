const db = require('../db/connection')

exports.removeCommentById = (comment_id) => {
    return db.query(
        `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`,[comment_id]
    )
    .then(({rows})=>{
        if(!rows.length){
            return Promise.reject({ status:404, msg:"No Comment Found" })
        }
    })
}
exports.updateCommentById = ({comment_id},{inc_votes,body}) =>{
    if(inc_votes){
        return db.query(
            `UPDATE comments SET votes = votes+$1 WHERE comment_id = $2 RETURNING *;`,[inc_votes,comment_id]
        )
        .then(({rows})=>{
            if(!rows.length){
                return Promise.reject({ status:404, msg:"Comment Not Found." })
            }
            return rows[0]
        })
    }
    if(body){
        return db.query(
            `UPDATE comments SET body = $1 WHERE comment_id = $2 RETURNING *;`,[body,comment_id]
        )
        .then(({rows})=>{
            if(!rows.length){
                return Promise.reject({ status:404, msg:"Comment Not Found." })
            }
            return rows[0]
        })
    }
    return Promise.reject({ status: 400, msg: "Missing Information." })
}
exports.removeCommentByArticleId = ({article_id}) => {
    return db.query(
        `DELETE FROM comments WHERE article_id = $1 RETURNING *;`,[article_id]
    )
}