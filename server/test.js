// getting-started.js
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

// connect
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Open!");
});

// user schema
var userSchema = mongoose.Schema({
  name: String,
  available: { type: Boolean, default: true }
});

// assign a function
userSchema.methods.messages = function (cb) {
  return Message.find({ user: this._id }, cb);
};

// room schema
var roomSchema = mongoose.Schema({
  name: String,
  capacity: { type: Number, max: 250 },
  available: { type: Boolean, default: true }
});

// message schema
var messageSchema = mongoose.Schema({
  date: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.ObjectId, ref: 'User', index: true },
  room: { type: mongoose.Schema.ObjectId, ref: 'Room', index: true },
  message: String,
  available: { type: Boolean, default: true }
});
// ensureIndex to false in production
// messageSchema.set('autoIndex', false);

// Model
var User = mongoose.model('User', userSchema);
var Room = mongoose.model('Room', roomSchema);
var Message = mongoose.model('Message', messageSchema);

// User Document
var user_1 = new User({ name: 'Emerson Estrella', available: true });

user_1.save(function (err, user_1) {
  if (err){ console.log(err); }
  console.log("User "+user_1.name+" saved!");
  
  // Message Document
  var msg_1 = new Message({ date: Date.now(), user: user_1._id, message: "Test 1 2 3...", available: true });
  msg_1.save(function (err, msg_1){
    if (err){ console.log(err); }
    console.log("Message "+msg_1.message+" saved!");

    console.log(user_1.name);
    console.log(user_1.messages());

  });

});
