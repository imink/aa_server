// load required packages
var formatter = require('../utils/formatter');
var restify = require('restify');
var config = require('../../config'); // get our config file


// model 
var Transaction = require('../models/transaction');


exports.crtTran = function(res, req, next) {
	var newTran = new Transaction(req.params);
	newTran.start_ts = Date.now();
	newTran.status = 1; // doing
	newTran.save(function(err) {
		if (err) return	next(err);
		data = newTran._id; // tran ID
		res.send(formatter.createRes(3001, 'start transaction ...', data));
	});
};

// finish a transcation correctly
exports.endTran = function(res, req, next) {
	Transaction.findOne({_id: req.params.id, userId: req.params.uid, status: 1}, function(err, transaction) {
		if (err) return next(err);
		if (transaction) {
			transaction.status = 2;
			transaction.end_ts = Date.now();
			transaction.save(function(err) {
				if (err) return next(err);
				res.json(formatter.createRes(3002, 'ending transaction', ''));
			});
		} else {
			res.json(formatter.createRes(3002, 'no current transaction', ''));
		}
	});
};
// finish a transcation by user mannual
exports.cancelTran = function(res, req, next) {

};


exports.updateTran = function(res, req, next) {

};

exports.getTran = function(res, req, next) {
	Transaction.findOne({_id: req.params.id, userId: req.params.uid}, function(err, transaction) {
		if (err) return next(err);
		if (transaction) {
			res.json(formatter.createRes(3002, 'get transaction info', transaction));
		} else {
			res.json(formatter.createRes(3002, 'no current transaction', ''));	
		}
	});

};
exports.deleteTran = function(res, req, next) {
	Transaction.findOneAndRemove({_id: req.params.id, userId: req.params.uid}, function(err, transaction) {
		if (err) return next(err);
		res.json(formatter.createRes(3002, 'delete transaction successfully', ''));	
	});
};


exports.getTransList = function(res, req, next) {
	Transaction.find({userId: req.auth._doc._id}, function(err, transactions) {
		if (err) return next(err);
		if (transactions) {
			res.json(formatter.createRes(2111, 'get trans success', transactions));
		} else {
			res.json(formatter.createRes(2112, 'no transactions found', ''));
		}
	});

};
