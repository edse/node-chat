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
  return this.model('Message').find({ user: this.type }, cb);
}

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
  room: { type: mongoose.Schema.ObjectId, ref: 'User', index: true },
  message: String,
  available: { type: Boolean, default: true }
});
// ensureIndex to false
messageSchema.set('autoIndex', false);

// Model
var User = mongoose.model('User', userSchema);
var Room = mongoose.model('Room', roomSchema);
var Message = mongoose.model('Message', messageSchema);

// Document
var user_1 = new User({ name: 'Emerson Estrella', available: true })
console.log(user_1.name) // 'Silence'

console.log('1');


