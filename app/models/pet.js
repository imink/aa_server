// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');



var PetSchema = new mongoose.Schema({
  name: String,
  description: String, 
  masterId: mongoose.Schema.Types.ObjectId,
  basic: {
		gender: String,
		breed: String,
		yob: Date,
		size: [String, Number],
		vacUptoDate: Boolean,
		sterilization: Boolean,
		friendlyToDogs: Boolean 		
  }, 
  behaviours: {
  	routine: String,
  	friendlyToChild: Boolean,
  	digs: Boolean,
  	jumpsOnPeople: Boolean,
  	isMicroChipped: Boolean
  }, 
  health: {
  	medication: String,
  	allergies: String,
  	vetName: String,
  	vetAddr: String,
  	vetPhone: Number,
  	insName: String,
  	insNumber: String
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