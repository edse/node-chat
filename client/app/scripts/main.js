var socket = io.connect('http://ec2-54-200-64-193.us-west-2.compute.amazonaws.com:8080');
socket.on('connect', function (data) {
  console.log('connect');
  console.log(data);
  $('#chat-content').html("");
  $('.status').html('connected');
  $('.status').removeClass("text-danger").addClass("text-success");
  $('#input-name').prop('disabled', false);
  $('#input-message').prop('disabled', false);
  $('#send').removeClass('disabled').addClass('btn-primary');
});

socket.on('disconnect', function (data) {
  console.log('disconnect');
  console.log(data);
  $('.status').html('disconnected');
  $('.status').removeClass("text-success").addClass("text-danger");
  $('#input-name').prop('disabled', true);
  $('#input-comment').prop('disabled', true);
  $('#send').removeClass('btn-primary').addClass('disabled');
});

socket.on('message', function (data) {
  console.log('message');
  console.log(data);
  console.log(data);
  $('#chat-content').append('<tr id="id'+data.id+'"><td class="text-primary time">'+data.time+'</td><td><strong>'+data.name+':</strong> '+data.message+'</td></tr>');
  $("#chat-content").scrollTop(document.getElementById('chat-content').scrollHeight+2); 
});

socket.on('messages', function (data) {
  console.log('message');
  console.log(data);
  $.each(data.messages, function( key, value ) {
    $('#chat-content').append('<tr id="id'+value.id+'"><td class="text-primary time">'+value.time+'</td><td><strong>'+value.name+':</strong> '+value.message+'</td></tr>');
  });
  $("#chat-content").scrollTop(document.getElementById('chat-content').scrollHeight+2); 
});

$("textarea, input").keypress(function(event) {
  if(event.which == 13) {
    event.preventDefault();
    send();
  }
});

$("#send").click(function() {
  send();
});

function send() {
  if(!$("#input-name").val()){
    $("#input-name").focus();
    return;
  }
  if(!$("#input-message").val()){
    $("#input-message").focus();
    return;
  }
  socket.emit('send', { name: $("#input-name").val(), message: $("#input-message").val() }); 
  $("#input-message").val("").focus();
};