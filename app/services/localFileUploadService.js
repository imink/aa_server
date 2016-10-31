var formidable = require('formidable');
var util = require('util');
var formatter = require('../utils/formatter');

var Pet   = require('../models/pet'); // get our mongoose model
var User   = require('../models/user'); // get our mongoose model


exports.upload = function(req, res, next) {
	// console.log(req);
	var form = new formidable.IncomingForm();
	form.uploadDir = "./public/img";
	form.maxFields = 2048;
	form.keepExtensions = true;
		console.log("goo");

	form.parse(req, function(err, fields, files) {
		if (err) return next(err);
		console.log("goo2");

		if (req.params.type == "pet") {
    	res.send(formatter.createRes(2001, 'pet avatar upload success', files));
		} else if (req.params.type == "user") {
			User.findOneAndUpdate({_id: req.auth._doc._id}, {avatar: "name"}, function(err, user){
				if (err) return next(err);
		    res.send(formatter.createRes(2001, 'user avatar upload success', user));
			});
		} else {
    	res.send(formatter.createRes(2002, 'unknown img', ''));
		}
	});
};