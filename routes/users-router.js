const { getUsers, getUserByUsername, postUser, patchUser, deleteUser } = require("../controllers/users.controllers")
const usersRouter = require("express").Router()

usersRouter
    .route('/')
    .get(getUsers)
    .post(postUser)
usersRouter
    .route('/:username')
    .get(getUserByUsername)
    .patch(patchUser)
    .delete(deleteUser)

module.exports = usersRouter