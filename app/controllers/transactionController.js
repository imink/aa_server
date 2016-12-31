// load required packages
var formatter = require('../utils/formatter');
var restify = require('restify');
var config = require('../../config'); // get our config file
var rdService = require('../services/realtimeDispatchingService');

// model 
var Transaction = require('../models/transaction');


exports.crtTran = function(req, res, next) {
	//validation
	console.log("ok");

	var newTran = new Transaction(req.params);
	newTran.start_time = Date.now();
	newTran.status = "1"; // doing
	// var ns = rdService.crtNewNameSpace(req.io);
	rdService.crtNewNameSpace(req.io);
	var ns = "random";
	newTran.socket_ns = ns;
	newTran.save(function(err) {
		if (err) return	next(err);
		else {
			data = newTran._id; // tran ID
			// return the socket id
			res.json(formatter.createRes(3001, 'start transaction ...', newTran));
		}
	});
};

// finish a transcation correctly
exports.endTran = function(req, res, next) {
	Transaction.findOne({_id: req.params.id, user_id: req.auth._doc._id, status: 1}, function(err, transaction) {
		if (err) return next(err);
		else {
			if (transaction) {
				transaction.status = 2;
				transaction.end_time = Date.now();
				transaction.save(function(err) {
					if (err) return next(err);
					else res.json(formatter.createRes(3002, 'ending transaction success', ''));
				});
			} else {
				res.json(formatter.createRes(3002, 'no current transaction', ''));
			}			
		} 
	});
};
// finish a transcation by user mannual
exports.cancelTran = function(req, res, next) {

};


exports.updateTran = function(req, res, next) {
	Transaction.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, {new: true}, function(err, transcation) {
		if (err) return next(err);
		else {
			if (transcation) {
        res.json(formatter.createRes(2114, 'update user successfully', user));
			} else {

			}
		}
	});
};

exports.getTran = function(req, res, next) {
	Transaction.findOne({_id: req.params.id, user_id: req.auth._doc._id}, function(err, transaction) {
		if (err) return next(err);
		if (transaction) {
			res.json(formatter.createRes(3002, 'get transaction info', transaction));
		} else {
			res.json(formatter.createRes(3002, 'no current transaction', ''));	
		}
	});

};
exports.deleteTran = function(req, res, next) {
	Transaction.findOneAndRemove({_id: req.params.id, userId: req.params.uid}, function(err, transaction) {
		if (err) return next(err);
		res.json(formatter.createRes(3002, 'delete transaction successfully', ''));	
	});
};


exports.getTransList = function(req, res, next) {
	Transaction.find({userId: req.auth._doc._id}, function(err, transactions) {
		if (err) return next(err);
		if (transactions) {
			res.json(formatter.createRes(2111, 'get trans success', transactions));
		} else {
			res.json(formatter.createRes(2112, 'no transactions found', ''));
		}
	});

};
