var mongoose = require("mongoose"),
	ObjectId = mongoose.Schema.ObjectId;

var UserSchema = new mongoose.Schema({

  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
});
var model = mongoose.model('user', UserSchema);

exports.User = model;