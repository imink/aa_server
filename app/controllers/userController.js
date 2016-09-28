// load required packages
var formatter = require('../utils/formatter');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var restify = require('restify');
var config = require('../../config'); // get our config file


var secret = config.secret;


// models
var User = require('../models/user');


exports.crtFakeUser = function(req, res, next) {
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

  return next();
};


// Create endpoint /api/auth/post for POSTS
exports.postLogin = function(req, res, next) {
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
  return next();
};

// Create endpoint /api/auth/register for POSTS
exports.postRegister = function(req, res, next) {
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

  return next();
};


exports.getListUsers = function(req, res, next) {
  User.find({}, function(err, users) {
    res.json(formatter.createRes(2101, 'success', users));
  });
  return next();
};

exports.getMyProfile = function(req, res, next) {
  User.find({}, function(err, users) {
    res.json(formatter.createRes(2101, 'success', users));
  });

  return next();
};





