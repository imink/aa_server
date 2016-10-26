// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// // set up a mongoose model and pass it using module.exports
// module.exports = mongoose.model('User', new Schema({ 

// }));



var UserSchema = new mongoose.Schema({
  email: {
		type: String,
		unique: true,
		required: true		
  }, 
  password: {
  	type: String,
  	required: true,
    select: false
  }, 
  first_name: String,
  last_name: String,
  phone_no: Number,
  activated: Boolean,
  validate_code: Number,
  pets: [mongoose.Schema.Types.ObjectId],
});


// Execute before each user.save() call
UserSchema.pre('save', function(callback) {
  var user = this;

  // Break out if the password hasn't changed
  if (!user.isModified('password')) return callback();

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return callback(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return callback(err);
      user.password = hash;
      callback();
    });
  });
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);