// load required packages
var formatter = require('../utils/formatter');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var restify = require('restify');
var config = require('../../config'); // get our config file
var bcrypt = require('bcrypt-nodejs');

var secret = config.secret;

var Admin = require('../models/admin');


exports.postRegister = function(req, res, next) {

	var newAdmin = new Admin({ 
    email: req.params.email, 
    password: req.params.password,
    name: req.params.name,
    level: 0,
  });
	
	newAdmin.save(function(err) {
		if (err) return next(err);
		res.send(formatter.createRes(2001, 'register admin success', ''));
	});
}