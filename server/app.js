var express = require('express');
var http = require('http');
var fs = require('fs');

var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server); // this tells socket.io to use our express server

var today = new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate();
var logFile = today+'-messages.json';
var messages = [];
fs.readFile(logFile, 'utf8', function (err, data) {
  if (err) {
    console.log('Error: ' + err);
    return;
  }
  messages = JSON.parse(data);
});

app.get('/', function (req, res) {
  res.redirect('https://emersonestrella.appspot.com');
  //res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  console.log('connection');
    
  socket.emit('messages', {
    messages: messages
  });

  socket.emit('message', {
    time: new Date().getHours()+":"+('0'+(new Date().getMinutes())).slice(-2),
    name: 'Node Chat Server v.0.0',
    message: 'Hi there!'
  });

  socket.on('send', function (data) {
    console.log('send');
    console.log(data);
    var msg = {
      id: new Date().getTime(),
      time: new Date().getHours()+":"+('0'+(new Date().getMinutes())).slice(-2),
      name: data.name,
      message: replaceURLWithLinks(stripTags(data.message))
    };
    messages.push(msg);
    //socket.emit('message', msg); //only for sender
    //socket.broadcast.emit('message', msg); //all except sender
    io.sockets.emit('message', msg); //all

    //save messages to server
    fs.writeFile(logFile, JSON.stringify(messages), function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("JSON saved to "+logFile);
      }
    });

  });
});

function replaceURLWithLinks(text){
  var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  return text.replace(exp,"<a href='$1' target='_blank'>$1</a>");
}

function stripTags(input, allowed) {
  allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
    commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
    return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
  });
}

console.log("Express server listening on port 3000");