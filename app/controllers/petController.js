// load required packages
var formatter = require('../utils/formatter');


// model 
var Pet = require('../models/pet');
var User = require('../models/user');

exports.getAllPetList = function(req, res, next) {
	// check if admin login
	Pet.find({}, function(err, pets) {
		if (err) return next(err);
		else {
			if (pets) {
				res.json(formatter.createRes(2142, 'get all pets list successfully', pets));
			} else {
				res.json(formatter.createRes(2143, 'get all pets list failed', pets));
			}
		}	
	});
}

exports.updatePetById = function(req, res, next) {
	Pet.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, {new: true}, function(err, pet) {
		if (err) return next(err);
		else {
			if (pet) {
				res.json(formatter.createRes(2122, 'update pet success', pet));
			} else {
				res.json(formatter.createRes(2123, 'no pet such', ''));
			}
		}
	});
}


// get list of pets info
exports.getMyPetList = function(req, res, next) {
	Pet.find({masterId: req.auth._doc._id}, function(err, pets) {
		if (err) return next(err);
		else {
			if (pets) {
				res.json(formatter.createRes(2140, 'get pet success', pets));
			} else {
				res.json(formatter.createRes(2141, 'pet not found', ''));
			}
		}		
	});
	// return next();
}

exports.getMyPetById = function(req, res, next) {
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
}

exports.getPetById = function(req, res, next) {
	Pet.findOne({_id: req.params.id}, function(err, pet) {
		if (err) return next(err);
		else {
			if (pet) {
				res.json(formatter.createRes(2144, 'get pet by id success', pet));
			} else {
				res.json(formatter.createRes(2145, 'get pet by id fail', ''));
			}
		}
	});
}


// create a new pet
exports.crtNewPet = function(req, res, next) {
	var newPet = new Pet(req.params);

	newPet.masterId = req.auth._doc._id;

	User.findOne({_id: req.auth._doc._id}, function(err, user) {
		user.pets.push(newPet._id);
		user.save(function(err, user) {
			// update user pets attribute
		});
	});

	newPet.save(function(err){
		if (err) res.json(err);
		else {
	    res.send(formatter.createRes(2110, 'create pet success', {'pet_id': newPet._id}));			
		}
	});
	// return next();
}

// update pet info
exports.updateMyPetById = function(req, res, next) {

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