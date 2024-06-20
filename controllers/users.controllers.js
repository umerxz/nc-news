const { fetchUsers, fetchUserByUsername, addUser } = require("../models/users.models")

exports.getUsers = (req, res, next) => {
    fetchUsers()
    .then((users)=>{
        res.status(200).send({users})
    })
}
exports.getUserByUsername = (req, res, next) => {
    fetchUserByUsername(req.params.username)
    .then((user)=>{
        res.status(200).send({user})
    })
    .catch(next)
}
exports.postUser = (req,res,next) => {
    addUser(req.body)
    .then((user)=>{
        res.status(201).send({user})
    })
    .catch(next)
} 