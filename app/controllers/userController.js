// load required packages
var formatter = require('../utils/formatter');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var restify = require('restify');
var config = require('../../config'); // get our config file
var bcrypt = require('bcrypt-nodejs');


var secret = config.secret;


// models
var User = require('../models/user');


// service 
var smsService = require('../services/authSmsService');

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

  // return next();
};


exports.getProfile = function(req, res, next) {
  User.findOne({_id: req.auth._doc._id}, function(err, user){
    if (err) return next(err);
    if (user) res.send(formatter.createRes(2004, 'get user success', user));
    else res.json(formatter.createRes(2002, 'user not found', ''));
  });
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
    } 
    bcrypt.compare(req.params.password, user.password, function(err, isMatch){
      if(err) throw err;
      if(!isMatch) {
        res.json(formatter.createRes(2003, 'password not correct', ''));
      } 
    }); 
    
    var token = jwt.sign(user, secret, {
      expiresIn: '7d' // 24 hrs
    });
    
    res.json(formatter.createRes(2004, 'success', {'token':token, 'user':user}));
    
  
  });  
  // return next();
};

// Create endpoint /api/auth/register for POSTS
exports.postRegister = function(req, res, next) {
  // create a user
  var newUser = new User({ 
    email: req.params.email, 
    password: req.params.password,
    last_name: req.params.last_name,
    first_name: req.params.first_name,
    phone_no: req.params.phone_no,
    activated: false 
  });

  // save the user
  newUser.save(function(err) {
    // if (err) next(err);
    if (err) throw err;  
    console.log('User saved successfully');
    res.send(formatter.createRes(2001, 'register success', ''));
  });

  // return next();
};


exports.getLogout = function(req, res, next) {
  
}


exports.getListUsers = function(req, res, next) {
  User.find(function(err, users) {
    if (err) throw err;
    res.send(formatter.createRes(2101, 'success', users));
  });
  // return next();
};

exports.getMyProfile = function(req, res, next) {
  User.find({}, function(err, users) {
    res.json(formatter.createRes(2101, 'success', users));
  });
};



exports.getSms = function(req, res, next) {
  console.log(smsService.crtSmsCode());
  res.json(formatter.createRes(2001, 'success', smsService.crtSmsCode()));
  // return next();
};




