var restify = require('restify');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var morgan      = require('morgan');
var mongoose = require('mongoose');
var formatter = require('./app/utils/formatter');
var socketio = require('socket.io');
var socketClient = require('socket.io-client');
var secret = config.secret;

var socketioJwt = require('socketio-jwt');





// controller
var userController = require('./app/controllers/userController');
var petController = require('./app/controllers/petController');
var transactionController = require('./app/controllers/transactionController');
var driverController = require('./app/controllers/driverController');
var adminController = require('./app/controllers/adminController');

// middleware
var authMiddleware = require('./app/middleware/authMiddleware');
var socketioMiddleware = require('./app/middleware/socketioMiddleware');

// service
var smsService = require('./app/services/authSmsService');
var localFileUploadService = require('./app/services/localFileUploadService');
var locationService = require('./app/services/locationService');
var realtimeDispatchingService = require('./app/services/realtimeDispatchingService');

var host = process.env.HOST || 'localhost';
var port = process.env.PORT || '8080';
mongoose.Promise = global.Promise;
mongoose.connect(config.database); // connect to database


var server = restify.createServer({
  name: 'AA API Server'
});
	
var io = socketio.listen(server.server);

// server.use(
//   function crossOrigin(req,res,next){
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     return next();
//   }
// );
server.use(restify.CORS());

server.opts(/.*/, function (req,res,next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", req.header("Access-Control-Request-Method"));
    res.header("Access-Control-Allow-Headers", req.header("Access-Control-Request-Headers"));
    res.send(200);
    return next();
});

server.use(restify.queryParser()); // parse the req url
// server.use(restify.bodyParser()); // parse the post body into query
server.use(restify.jsonBodyParser());



// use morgan to log requests to the console
server.use(morgan('dev'));

// setup public folder, binding public to resource path
// eg. /public/img/upload_84c286ddcae5960c34931dfa9e326f63.png binding to ./public/img
server.get(/\/public\/?.*/, restify.serveStatic({
    directory: __dirname
}));




server.get('api/auth/fake-user', userController.crtFakeUser);
server.post('api/auth/register', userController.postRegister);
server.post('api/auth/login', userController.postLogin);
server.get('api/auth/get-sms', userController.getSms);
server.post('api/auth/forgot-password', userController.forgotPassword);

// admin model api
server.post('/api/admin/register', adminController.postRegister);

server.use(authMiddleware.validateUser);
server.get('api/auth/logout', userController.getLogout);
server.get('api/user/profile', userController.getProfile);
server.get('apt/auth/verify', authMiddleware.validateUser);
server.post('api/auth/update-password', userController.updatePassword);
server.get('/api/list/users', userController.getListUsers);


// admin user
server.get('api/user/:id', userController.getUserById);
server.post('api/user/update', userController.updateUserProfile);



// file upload
server.post('api/pet/avatar-upload/:id', localFileUploadService.petAvatarUpload);
server.post('api/user/avatar-upload',localFileUploadService.userAvatarUpload);


// pet api
server.get('/api/my/pet/list', petController.getMyPetList);
server.post('/api/my/pet/new', petController.crtNewPet);
server.get('api/pet/fake-pet', petController.crtFakePet);
server.get('api/my/pet/:id', petController.getMyPetById);
server.put('api/my/pet/:id', petController.updateMyPetById);
server.del('api/my/pet/:id', petController.deletePet);

// pet admin
server.get('api/admin/all/pet/list', petController.getAllPetList);
server.get('api/admin/pet/:id', petController.getPetById);
server.put('api/admin/pet/:id', petController.updatePetById);

// transaction api
server.get('/api/transactions/history', transactionController.getTransList);
server.post('/api/transaction/new', socketioMiddleware.addIO(io), transactionController.crtTran); //start new service, open a nampespace
// server.post('/api/transaction/new', transactionController.crtTran); //start new service
server.get('api/transaction/:id', transactionController.getTran);
server.put('api/transaction/:id', transactionController.updateTran);
server.get('api/transaction/:id/cancel', socketioMiddleware.addIO(io), transactionController.cancelTran);  // close the socket
server.get('api/transaction/:id/finish', socketioMiddleware.addIO(io), transactionController.endTran); // close the socket

// transaction admin
server.get('api/admin/transaction/:id', transactionController.getTranById);
server.del('api/admin/transaction/:id', transactionController.deleteTran); 




// driver api
server.get('/api/driver/list/:id', driverController.getDriverList);
server.del('api/driver/:id', driverController.deleteDriver);
server.post('/api/driver/new', driverController.crtNewDriver);
server.get('api/driver/:id', driverController.getDriver);
server.put('api/driver/:id', driverController.updateDriver);




var drivers = {};
var users = {};






	// var ns = "random2";
	// var newNs = io.of('/' + ns);
	// // var userSocketId = "";
	// // var driverSocketId = "";

	// newNs.on('connection', function(socket){
 //  	console.log('pair connected 2');
 //  	// register event listner 
 //  	// realtimeDispatchingService.initPair(socket);
	// 	// realtimeDispatchingService.updateDriverLoc(socket);
	// 	// realtimeDispatchingService.updateUserLoc(socket);
	// 	// realtimeDispatchingService.updatePetStatus(socket);
	// 	realtimeDispatchingService.closeSocket(socket, drivers, 2);
	// });





// io.sockets
var commonroom = "commonroom";
	io.of('/' + commonroom)
  .on('connection', socketioJwt.authorize({
    secret: secret,
    timeout: 1000 // 15 seconds to send the authentication message
  }))
  .on('authenticated', function(socket) {
    //this socket is authenticated, we are good to handle more events from it.
		// console.log('connected & authenticated: ' + JSON.stringify(socket.decoded_token._doc._id));
	  // socket.on('init', function(data) {
			// if (data.isDriver) {
			// 	drivers[socket.id] = {
			// 		id: socket.id,
			// 		latLng: data.latLng

			// 	};
			// 	socket.isDriver = data.isD	river;
			// 	console.log("[Driver Added] at " + socket.id);
			// 	socket.broadcast.to('customers').emit('driverAdded', drivers[socket.id]);

			// } else {
			// 	socket.join('customers');
			// 	console.log("[Customer Added] at " + socket.id);

			// 	var clients = io.sockets.adapter.rooms['customers'];
			// 	socket.emit('initDriverLoc', drivers); 

			// 	// the client is customers, send divers info to customers

			// 	// console.log(clients);
			// }
  	// });
  	console.log('[Common Room] Authenticated');
  	realtimeDispatchingService.initUser(socket, users, drivers);
  	realtimeDispatchingService.initDriver(socket, drivers);
  	realtimeDispatchingService.updateUserListLoc(socket, users);
  	realtimeDispatchingService.updateDriverListLoc(socket, drivers);
  	realtimeDispatchingService.closeSocket(socket, drivers, 1);

		//  socket.on('book', function(customerData) {
		// 	var resData ={};
		// 	var matchedSocketId = locationService.getNearest(drivers, customerData);
		// 	console.log(matchedSocketId);
		// 	resData.id = matchedSocketId;	// id of booked car
		// 	if (matchedSocketId == 0) {
		// 		socket.emit('bookid', resData);
		// 	} else {
		// 		socket.emit('bookid', resData);
		// 		socket.broadcast.to(matchedSocketId).emit('drivePath', customerData);
		// 	}    
		// });
  });

var pairNs = "random";
var pairNs = io.of('/' + pairNs);
pairNs.on('connection', function(socket){
	console.log('pair connected 1');
	// register event listner 
	realtimeDispatchingService.initPair(socket);
	realtimeDispatchingService.updateDriverLoc(socket);
	realtimeDispatchingService.updateUserLoc(socket);
	realtimeDispatchingService.updatePetStatus(socket);
	realtimeDispatchingService.closeSocket(socket, drivers, 2);
});





server.listen(port,host, function() {
  console.log('%s listening at %s at time %s', server.name, server.url,  new Date().toLocaleString().substr(0, 12));
});


