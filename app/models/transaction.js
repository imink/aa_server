  // get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');



var TransactionSchema = new mongoose.Schema({
  duration: String,
  start_time: Date,
  end_time: Date,
  pickup_addr: String,
  dropoff_addr: String,
  pets: [mongoose.Schema.Types.ObjectId],
  user_id: mongoose.Schema.Types.ObjectId,
  driver: {
    id: mongoose.Schema.Types.ObjectId,
    socket_id: String,
    latLng: [Number],
    info: String
  },
  status: String,
  fee: Number,
  status: Number,
  payment:mongoose.Schema.Types.ObjectId,
  socket_ns: String
},
{
  timestamps: { createdAt: 'created_at' }
}
);


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