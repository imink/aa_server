var multer  = require('multer');
var path = require('path');
var formatter = require('../utils/formatter');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../../config'); // get our config file

var User = require('../models/user');
var Pet = require('../models/pet');
// img cdn
var cloudinary = require('cloudinary');

cloudinary.config(config.cdn);

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
  }
});

var limits = {
	fileSize: 1024 * 1024 * 2 
};

function fileFilter (req, file, cb) {
 	if (file.mimetype.match(/^(image\/jpeg|image\/png|image\/gif)$/)) {
		return cb(null, true);
	} else {
	  req.fileValidationError = 'goes wrong on the mimetype';
	  return cb(null, false, new Error('goes wrong on the mimetype'));
	}
}

exports.userAvatarUpload = function(req, res, next) {

	var upload = multer({ storage: storage, limits: limits, fileFilter: fileFilter}).single('user');
	upload(req, res, function(err){
		if (req.fileValidationError) res.json({err:req.fileValidationError});
		else if (err) res.json(err);
		else {
			// cdn uploader
			cloudinary.uploader.upload(req.file.path, function(result) {
				// console.log(result);
				User.findOneAndUpdate({_id: req.auth._doc._id}, {avatar: result.url}, {new: true}, function(err, user) {
					if (err) res.json(err);
					else {
						if (user) {
				  		res.send(formatter.createRes(2015, 'user avatar upload successfully', user));					
						} else {
			        res.json(formatter.createRes(2002, 'user not found', ''));	
						}
					}
				});				
			});
		}
	}); 		
};



exports.petAvatarUpload = function(req, res, next) {
	var upload = multer({ storage: storage, limits: limits, fileFilter: fileFilter}).single('pet');

	upload(req, res, function(err){
		if (req.fileValidationError) res.json({err:req.fileValidationError});
		else if (err) return next(err);
		else {
			// cdn uploader
			// console.log(req.params.id + 'id');
			cloudinary.uploader.upload(req.file.path, function(result) {
				// console.log(result);
				if (!req.params.id) {
	        res.json(formatter.createRes(2122, 'pet avatar upload success', {url: result.url}));	
				} else {
						Pet.findOneAndUpdate({_id: req.params.id, masterId: req.auth._doc._id}, {'basic.avatar': result.url}, {new: true}, function(err, pet) {
							if (err) res.json(err);
							else {
								if (pet) {
						  		res.send(formatter.createRes(2122, 'pet avatar upload success', pet));					
								} else {
					        res.json(formatter.createRes(2123, 'pet avatar upload fail', ''));	
								}
							}
						});				
				}				
			});
		}
	}); 		
};