var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var formatter = require('../utils/formatter');

var config = require('../../config'); // get our config file
var secret = config.secret;


exports.validateUser = function(req, res, next) {
  // check header token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
  	jwt.verify(token, secret, function(err, decoded){
  	  if (err) {
  	  	return res.json(formatter.createRes(2014, 'failed', 'token failed'));  	  	
  	  } else {
  	  	req.decoded = decoded;
  	  	next();
  	  }

  	});
  } else {
  	// no token
  	res.send(formatter.createRes(2015, 'fialed', 'no token'));
  }
  return next();
};