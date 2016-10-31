var formidable = require('formidable');
var util = require('util');
var formatter = require('../utils/formatter');



exports.upload = function(req, res, next) {
	// console.log(req);
	var form = new formidable.IncomingForm();
	form.uploadDir = "./resource/img";
	form.maxFields = 2048;
	form.keepExtensions = true;
	form.parse(req, function(err, fields, files) {
		if (err) return next(err);
	  // res.writeHead(200, {'content-type': 'text/plain'});
	  // res.write('received upload:\n\n');
	  // res.end(util.inspect({fields: fields, files: files}));
	  var data = {};
	  data.fields = fields;
	  data.files = files;
	  data.name = "file name";
    res.send(formatter.createRes(2001, 'file upload success', data));
	});
};