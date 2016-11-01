var multer  = require('multer');
var path = require('path');
var formatter = require('../utils/formatter');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../../config'); // get our config file

var User = require('../models/user');
var Pet = require('../models/pet');



var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
  }
});


exports.userAvatarUpload = function(req, res, next) {

	var upload = multer({ storage: storage}).single('user');

	upload(req, res, function(err){
		if (err) return next(err);
		User.findOneAndUpdate({_id: req.auth._doc._id}, {avatar: req.file.filename}, function(err, user) {
			if (err) return next(err);
  		res.send(formatter.createRes(2015, 'user avatar upload successfully', req.file.filename));
		});
	}); 		
};



exports.petAvatarUpload = function(req, res, next) {
	var upload = multer({ storage: storage}).single('pet');

	upload(req, res, function(err){
		if (err) return next(err);
		res.send(formatter.createRes(2015, 'user avatar upload successfully', req.file.filename));
	}); 		
};