module.exports = {
  addIO: function (io) {
    return function (req, res, next) {
      req.io = io;
      next();
    };
  }
}