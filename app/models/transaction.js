// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');



var TransactionSchema = new mongoose.Schema({
  duration: Number,
  start_ts: Date,
  end_ts: Date,
  type: Number, 
  pickup_addr: String,
  dropoff_addr: String,
  dogs: [mongoose.Schema.Types.ObjectId],
  userId: mongoose.Schema.Types.ObjectId,
  driverId: mongoose.Schema.Types.ObjectId,
  fee: Number,
  discount: Number,
  totalFee: Number,
  status: Number
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
module.exports = mongoose.model('Transcation', TransactionSchema);