var _this = this;


exports.crtNewNameSpace = function(io) {
	var ns = "random";
	var newNs = io.of('/' + ns);
	// var userSocketId = "";
	// var driverSocketId = "";

	newNs.on('connection', function(socket){
  	console.log('pair connected');
  	// register event listner 
  	_this.initPair(socket);
		_this.updateDriverLoc(socket);
		_this.updateUserLoc(socket);
		_this.updatePetStatus(socket);
		_this.closeSocket(socket);
	});
	// return ns;
}

exports.initPair = function(socket) {
	socket.on('initPairUser', function() {
		// userSocketId = socket.id;
		console.log("[User Connect From] " + socket.id);
	});
	socket.on('initPairDriver', function() {
		// driverSocketId = socket.id;
		console.log("[Driver Connect From] " + socket.id);
	})
}

exports.updateDriverLoc = function(socket) {
	socket.on('updateDriverLoc', function(data) {
		console.log('updateDriverLoc');
		socket.broadcast.emit('updateDriverLoc', data);
	});
}

exports.updateUserLoc = function(socket) {
	socket.on('updateUserLoc', function(data) {
		console.log('updateUserLoc');
		socket.broadcast.emit('updateUserLoc', data);
	});
}

exports.updateDriverListLoc = function(socket, drivers) {
	socket.on('updateDriverListLoc', function(data) {
		console.log('updateDriverListLoc');
		
		drivers[socket.id] = {
			id: socket.id,
			latLng: data.latLng
		}

		socket.broadcast.to('customers').emit('updateDriverListLoc', {
			id: socket.id,
			latLng: data.latLng
		})
	});
}

exports.updateUserListLoc = function(socket, users) {
// update user list loc from view of drivers                                                
}

exports.updatePetStatus = function(socket) {
	socket.on('updatePetStatus', function(data) {
		console.log('updatePetStatus');
		socket.broadcast.emit('updatePetStatus', data);
	});
}

exports.initUser = function(socket, users, drivers) {
	socket.on('initUser', function(data) {
		socket.join('customers');
		console.log("[Customer Added] at " + socket.id);
		users[socket.id] = {
			id:socket.id,
			latLng: data.latLng
		}
		socket.emit('initDriverLocList', drivers); 
	});
}

exports.initDriver = function(socket, drivers) {
	socket.on('initDriver', function(data) {
		drivers[socket.id] = {
			id: socket.id,
			latLng: data.latLng
		}
		socket.isDriver = true;
		console.log("[Driver Added] at " + socket.id);
		socket.broadcast.to('customers').emit('addDrivers', drivers[socket.id]);  		
	});
}

exports.closeSocket = function(socket, drivers, num) {
	socket.on('disconnect', function() {
		console.log("num: " + num);
		if (socket.isDriver) {
			delete drivers[socket.id];			
			console.log("[Driver Disconnected] at: " + socket.id);
			socket.broadcast.to('customers').emit('removeDrivers', drivers[socket.id]);
		}
		 else {
			console.log("[Customer Disconnected] at: " + socket.id);
		}
	});

  socket.on('forceDisconnect', function() {
  	console.log('forceDisconnect');
  	socket.disconnect();
  	// io.close();
  })
}
