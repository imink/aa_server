var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');



var DriverSchema = new mongoose.Schema({
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
  avatar: String,
	first_name: String,
  last_name: String,
	phone_no: Number,
  activated: Boolean,
  validate_code: Number,
  car: {
  	brand: String,
  	years: Number,
  }

});


// Execute before each user.save() call
DriverSchema.pre('save', function(callback) {
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


module.exports = mongoose.model('Driver', DriverSchema);