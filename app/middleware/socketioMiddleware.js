module.exports = {
  addIO: function (io, redisClient) {
    return function (req, res, next) {
      req.io = io;
      req.redisClient = redisClient;
      next();
    };
  }
}