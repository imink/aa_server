// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');



var PetSchema = new mongoose.Schema({
  masterId: mongoose.Schema.Types.ObjectId,
  basic: {
    pic: String,
    name: String,
    description: String, 
		gender: String,
		breed: String,
		yob: Number,
		size: String,
    spayed: Boolean,
		vac_uptodate: Boolean,
		sterilization: Boolean,
		friendly_to_dogs: Boolean 		
  }, 
  behaviours: {
  	commands: String,
    is_in_season: Boolean,
  	friendly_to_child: Boolean,
    pulls: Boolean,
    barks: Boolean,
  	digs: Boolean,
  	jumps_on_people: Boolean,
  	is_chipped: Boolean,
    has_id_tag: Boolean
  }, 
  health: {
  	medication: String,
  	allergies: String,
  	veterinary: {
      name: String,
      addr: String,
      phone: String,
    },
    insurance: {
      name: String,
      number: String,
    }
  }
});


// // Execute before each user.save() call
// UserSchema.pre('save', function(callback) {
//   var user = this;

//   // Break out if the password hasn't changed
//   if (!user.isModified('password')) return callback();

//   // Password changed so we need to hash it
//   bcrypt.genSalt(5, function(err, salt) {
//     if (err) return callback(err);

//     bcrypt.hash(user.password, salt, null, function(err, hash) {
//       if (err) return callback(err);
//       user.password = hash;
//       callback();
//     });
//   });
// });

// Export the Mongoose model
module.exports = mongoose.model('Pet', PetSchema);