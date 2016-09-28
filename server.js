var restify = require('restify');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var morgan      = require('morgan');
var mongoose = require('mongoose');
var formatter = require('./app/utils/formatter');


// controller
var userController = require('./app/controllers/userController');

// middleware
var authMiddleware = require('./app/middleware/authMiddleware.js');


var User   = require('./app/models/user'); // get our mongoose model

var host = process.env.HOST || '127.0.0.1';
var port = process.env.PORT || '8080';
mongoose.Promise = global.Promise;
mongoose.connect(config.database); // connect to database


var server = restify.createServer({
  name: 'AA API Server'
});


server.use(restify.queryParser()); // parse the req url
server.use(restify.bodyParser()); // parse the post body into query
// use morgan to log requests to the console
server.use(morgan('dev'));


server.get('api/auth/fake-user', userController.crtFakeUser);
server.post('api/auth/register', userController.postRegister);
server.post('api/auth/login', userController.postLogin);
server.use(authMiddleware.validateUser);
server.get('/api/list/users', userController.getListUsers);


server.listen(port,host, function() {
  console.log('%s listening at %s', server.name, server.url);
});