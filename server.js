var restify = require('restify');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var morgan      = require('morgan');
var mongoose = require('mongoose');
var formatter = require('./app/utils/formatter');




var User   = require('./app/models/user'); // get our mongoose model

var host = process.env.HOST || '127.0.0.1';
var port = process.env.PORT || '8080';
mongoose.Promise = global.Promise;
mongoose.connect(config.database); // connect to database


var server = restify.createServer({
  name: 'AA API Server'
});

var secret = config.secret;

server.use(restify.queryParser()); // parse the req url
server.use(restify.bodyParser()); // parse the post body into query
// use morgan to log requests to the console
server.use(morgan('dev'));

server.get('api/auth/fake-user', function(req, res){
	var fakeUser = new User({
	    email: 'fake@fake.com',
	    password: 12345,
	    last_name: 'fake',
	    first_name: 'fake',
	    phone_no: 12345,
	    activated: false 
	});
	fakeUser.save(function(err) {
	    if (err) throw err;
	    console.log('fake user created.');
   		res.send(formatter.createRes(2001, 'fake register success', ''));
	});
});




server.post('api/auth/register', function(req, res) {
  // create a user
  var nick = new User({ 
    email: req.params.email, 
    password: req.params.password,
    last_name: req.params.last_name,
    first_name: req.params.first_name,
    phone_no: req.params.phone_no,
    activated: false 
  });

  // save the user
  nick.save(function(err) {
    if (err) throw err;
    console.log('User saved successfully');
   	res.send(formatter.createRes(2001, 'register success', ''));
  });
});


server.post('api/auth/login', function(req, res, next) {
  console.log(req.params);
  if (!req.params.email && !req.params.password) {
	return res.json(formatter.createRes(2014, 'no email and password', ''));  	
  } else if (!req.params.email) {
	return res.json(formatter.createRes(2014, 'no email', ''));  	
  } else if (!req.params.password) {
	return res.json(formatter.createRes(2014, 'no password', ''));  	
  } 
 
  User.findOne({
    email: req.params.email
  }, function(err, user) {
  	if (err) next(new restify.errors.ResourceNotFoundError());
  	if (!user) {
  		res.json(formatter.createRes(2002, 'user not found', ''));
  	} else if (user) {
  		if (user.password != req.params.password) {
  			res.json(formatter.createRes(2003, 'password not correct', ''));
  		} else {
  			var token = jwt.sign(user, secret, {
  				expiresIn: '1440m' // 24 hrs
  			});
  			res.json(formatter.createRes(2004, 'success', {token:token}));
  		}
  	}
  });
});

server.use(function(req, res, next){
  // check header token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
  	jwt.verify(token, secret, function(err, decoded){
  	  if (err) {
  	  	return res.json(formatter.createRes(2014, 'success', 'token failed'));  	  	
  	  } else {
  	  	req.decoded = decoded;
  	  	next();
  	  }

  	});
  } else {
  	// no token
  	res.send(formatter.createRes(2015, 'success', 'no token'));
  }
});

server.get('/api/list/users', function(req, res, next){
  User.find({}, function(err, users) {
	  res.json(formatter.createRes(2101, 'success', users));
  });
});


server.listen(port,host, function() {
  console.log('%s listening at %s', server.name, server.url);
});