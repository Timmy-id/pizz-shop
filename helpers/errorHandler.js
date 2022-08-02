function errorHandler(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    return res
      .status(401)
      .json({ success: false, message: 'User not authorized' });
  } else next(err);
}

module.exports = errorHandler;
