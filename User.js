var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var UserSchema = new Schema({
  id: {
  	type: String,
    unique: true,
    default: ObjectId
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});


module.exports.User = mongoose.model('user', UserSchema);