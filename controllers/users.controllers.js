const { fetchUsers, fetchUserByUsername, addUser, updateUser, removeUserComments, removeUserArticles, removeUser } = require("../models/users.models")

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
exports.patchUser = (req,res,next) => {
    updateUser(req.body)
    .then((user) => {
        res.status(200).send({user})
    }).catch(next);
}
exports.deleteUser = (req,res,next) => {
    const { username } = req.params;
    fetchUserByUsername(username)
    .then((user) => {
        if (!user) {
            return Promise.reject({ status: 404, msg: 'User not found' });
        }
        return removeUserComments(username);
    })
    .then(() => {
        return removeUserArticles(username);
    })
    .then(() => {
        return removeUser(username);
    })
    .then(() => {
        res.status(204).send();
    })
    .catch((err) => {
        next(err);
    });
}