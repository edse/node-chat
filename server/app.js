/**
 * Module dependencies.
 */

var express = require('express'),
  http = require('http');

var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server); // this tells socket.io to use our express server

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  console.log('connection');
  socket.emit('message', {
    time: new Date().getHours()+":"+('0'+(new Date().getMinutes())).slice(-2),
    name: 'Node Chat Server v.0.0',
    message: 'Hi there!'
  });

  socket.on('send', function (data) {
    console.log('send');
    console.log(data);
    socket.emit('message', {
      id: new Date().getTime(),
      time: new Date().getHours()+":"+('0'+(new Date().getMinutes())).slice(-2),
      name: data.name,
      message: replaceURLWithLinks(data.message)
    });
  });
});

function replaceURLWithLinks(text){
  var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  return text.replace(exp,"<a href='$1' target='_blank'>$1</a>");
}

console.log("Express server listening on port 3000");
