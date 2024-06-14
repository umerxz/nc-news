const { invalidPaths } = require("../models/invalid-routes.models");

exports.invalidRoutes = (req, res, next) => {
    invalidPaths()
    .catch(next);
};