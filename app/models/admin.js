// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');



var AdminSchema = new mongoose.Schema(
{
  name: {
    type: String,
    unique: true,
    required: true
  },
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
  level: Number
},
{
  timestamps: { createdAt: 'created_at' }
}
);


// Execute before each admin.save() call
AdminSchema.pre('save', function(callback) {
  var admin = this;

  // Break out if the password hasn't changed
  if (!admin.isModified('password')) return callback();

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return callback(err);

    bcrypt.hash(admin.password, salt, null, function(err, hash) {
      if (err) return callback(err);
      admin.password = hash;
      callback();
    });
  });
});

// Export the Mongoose model
module.exports = mongoose.model('Admin', AdminSchema);