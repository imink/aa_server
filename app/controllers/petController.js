// load required packages
var formatter = require('../utils/formatter');


// model 
var Pet = require('../models/pet');

// get list of pets info
exports.getPetList = function(req, res, next) {
	Pet.find({masterId: req.auth._doc._id}, function(err, pets) {
		if (err) return next(err);
		else {
			if (pets) {
				res.json(formatter.createRes(2111, 'get pet success', pets));
			} else {
				res.json(formatter.createRes(2112, 'pet not found', ''));
			}
		}		
	});
	// return next();
};

exports.getPet = function(req, res, next) {
	Pet.findOne({_id: req.params.id, masterId: req.auth._doc._id}, function(err, pet){
		if (err) return next(err);
		else {
			if (pet) {
				res.json(formatter.createRes(2111, 'get pet success', pet));
			} else {
				res.json(formatter.createRes(2112, 'pet not found', ''));
			}
		}
	});
};

// create a new pet
exports.crtNewPet = function(req, res, next) {
	var newPet = new Pet(req.params);

	newPet.masterId = req.auth._doc._id;

	newPet.save(function(err){
		if (err) return next(err);
    res.send(formatter.createRes(2110, 'create pet success', {'pet_id': newPet._id}));
	});
	// return next();
};

// update pet info
exports.updatePet = function(req, res, next) {
	// console.log(req.body);

	// var updatedPet = new Pet(req.body);


	Pet.findOneAndUpdate({_id: req.params.id, masterId: req.auth._doc._id}, {$set: req.body}, {new: true}, function(err, pet) {
		if (err) return next(err);
		if (pet) {
			res.json(formatter.createRes(2114, 'update pet successfully', pet));
		} else {
			res.json(formatter.createRes(2112, 'pet not found', ''));
		}
	});
	// return next();
};

// delete pet
exports.deletePet = function(req, res, next) {

	Pet.findOneAndRemove({_id: req.params.id, masterId: req.auth._doc._id}, function(err, pet) {
		if (err) return next(err);
		if (pet) {
			res.json(formatter.createRes(2113, 'delete successfully', ''));
		} else {
			res.json(formatter.createRes(2112, 'pet not found', ''));
		}
	});
	// return next();
};


exports.crtFakePet = function(req, res, next) {

};