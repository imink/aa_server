var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var formatter = require('../utils/formatter');
var restify = require('restify');

var config = require('../../config'); // get our config file
var secret = config.secret;

var User = require('../models/user');

// execute before each secure API
exports.validateUser = function(req, res, next) {

  // check header token
  var token = req.headers['x-access-token'] || req.body.token || req.query.token;
  if (token) {
  	jwt.verify(token, secret, function(err, decoded){
  	  if (err) {
  	  	return res.json(formatter.createRes(2014, 'failed', 'token failed'));  	

  	  } else {
  	  	req.auth = decoded;
        console.log("ok");
  	  	next();
  	  }

  	});
  } else {
  	// no token    
  	res.send(formatter.createRes(2015, 'failed', 'no token'));
  }
};


// // execute before each secure API
// module.exports =  {
//   validateUser: function(req, res, next) {
//       // check header token
//     var token = req.body.token || req.query.token || req.headers['x-access-token'];
//     if (token) {
//       jwt.verify(token, secret, function(err, decoded){
//         if (err) {
//           return res.json(formatter.createRes(2014, 'failed', 'token failed'));       
//         } else {
//           req.auth = decoded;
//           req.temp = "good";
//           console.log(req.params);
//           next();
//         }

//       });
//     } else {
//       // no token
//       res.send(formatter.createRes(2015, 'failed', 'no token'));
//     }
//     return next();   
//   }

// };

