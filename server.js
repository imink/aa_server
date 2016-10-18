var restify = require('restify');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var morgan      = require('morgan');
var mongoose = require('mongoose');
var formatter = require('./app/utils/formatter');



var secret = config.secret;

// controller
var userController = require('./app/controllers/userController');
var petController = require('./app/controllers/petController');
var transactionController = require('./app/controllers/transactionController');
// middleware
var authMiddleware = require('./app/middleware/authMiddleware');


// service
var smsService = require('./app/services/authSmsService');

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

server.get('api/auth/get-sms', userController.getSms);


server.use(authMiddleware.validateUser);



server.get('/api/list/users', userController.getListUsers);


// pet api
server.get('/api/pet/list', petController.getPetsList);
server.post('/api/pet/new', petController.crtNewPet);
server.get('api/pet/fake-pet', petController.crtFakePet);
server.get('api/pet/:id', petController.getPet);
server.put('api/pet/:id', petController.updatePet);
server.del('api/pet/:id', petController.deletePet);


// transaction api
server.get('/api/transactions/list', transactionController.getTransList);
server.post('/api/transaction/new', transactionController.crtTran);
server.get('api/transaction/:id', transactionController.getTran);
server.put('api/transaction/:id', transactionController.updateTran);
server.del('api/transaction/:id', transactionController.deleteTran);
server.get('api/transaction/:id', transactionController.cancelTran);
server.get('api/transaction/:id', transactionController.endTran);






server.listen(port,host, function() {
  console.log('%s listening at %s', server.name, server.url);
});