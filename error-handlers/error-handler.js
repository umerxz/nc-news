
exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) res.status(err.status).send({ msg: err.msg })
    next(err)
};

exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({ msg: 'Internal Server Error' });
  };