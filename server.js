var restify = require('restify');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var morgan      = require('morgan');
var mongoose = require('mongoose');
var formatter = require('./app/utils/formatter');
var socketio = require('socket.io');
var socketClient = require('socket.io-client');

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
	
var io = socketio.listen(server.server);

// var ioClient = socketClient.connect("http://127.0.0.1:8080");

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
server.get('/api/my/pet/list', petController.getPetsList);
server.post('/api/my/pet/new', petController.crtNewPet);
server.get('api/pet/fake-pet', petController.crtFakePet);
server.get('api/my/pet/:id', petController.getPet);
server.put('api/my/pet/:id', petController.updatePet);
server.del('api/my/pet/:id', petController.deletePet);


// transaction api
server.get('/api/transactions/list', transactionController.getTransList);
server.post('/api/transaction/new', transactionController.crtTran);
server.get('api/transaction/:id', transactionController.getTran);
server.put('api/transaction/:id', transactionController.updateTran);
server.del('api/transaction/:id', transactionController.deleteTran);
server.get('api/transaction/:id', transactionController.cancelTran);
server.get('api/transaction/:id', transactionController.endTran);


function distance(lat1, lon1, lat2, lon2) {
	var p = 0.017453292519943295;
	var c = Math.cos;
	var a = 0.5 - c((lat2 - lat1) * p) / 2 +
		c(lat1 * p) * c(lat2 * p) *
		(1 - c((lon2 - lon1) * p)) / 2;

	return 12742 * Math.asin(Math.sqrt(a));
}

var drivers = {};
var driver1 = {"isDriver":true,
"latLong": [51.507351, -0.127758]};

// ioClient.emit('init', driver1);





// socket io
io.on('connection', function (socket) {
  socket.on('my event', function (data) {
          console.log(data.data);
  });

  socket.on('init', function(data) {
		if (data.isDriver) {
			drivers[socket.id] = {
				id: socket.id,
				latLong: data.latLong

			};
			socket.isDriver = data.isDriver;
			console.log("Driver Added at " + socket.id);
			socket.broadcast.to('customers').emit('driverAdded', drivers[socket.id]);
		} else {
			socket.join('customers');
			var clients = io.sockets.adapter.rooms['customers'];

			// the client is customers, send divers info to customers
			socket.emit('initDriverLoc', drivers);
			console.log(clients);

		}
  });

  socket.on('book', function(customerData) {
	var near = 0,length, nr = 0;
	var at, id, key;
	var lat1 = customerData.lat;
	var long1 = customerData.lng;
	var lat2, long2;
	var details={};
	if (customerData.type == 0) {
		at = Object.keys(drivers);
		id = at[0];
		length = Object.keys(drivers).length;
		console.log(length);

		if (length == 0)
			id = 0;
		else if (length == 1) {
			id = at[0];
		} else {
			for (key in at) {
				console.log('id=' + at[key])
				lat2 = drivers[at[key]].latLong[0]
				long2 = drivers[at[key]].latLong[1]
				nr = distance(lat1, long1, lat2, long2);

				if (nr < near) {
					near = nr;
					id = key;
				}
			}
		}
	}

		details[0]=id;	// id of booked car
		details[1]=customerData[1];	//type 0 for cab 
		socket.emit('bookid', details);
		if(details[1]==0)
		socket.to(id).emit('drivepath', customerData[0]);
	});

  socket.on('locChanged', function(data) {
		drivers[socket.id] = {
			id: socket.id,
			latLong: data.latLong
		}

		socket.broadcast.emit('driverLocChanged', {
			id: socket.id,
			latLong: data.latLong
		})
	});

	socket.on('disconnect', function() {
		if (socket.isDriver) {
			console.log("Driver disconnected at " + socket.id);
			socket.broadcast.to('customers').emit('driverRemoved', drivers[socket.id]);
			delete drivers[socket.id];
		}
		 else {
			console.log('Customer Disconnected at' + socket.id);
		}
	});






});






server.listen(port,host, function() {
  console.log('%s listening at %s at time %s', server.name, server.url,  new Date().toLocaleString().substr(0, 12));
});


