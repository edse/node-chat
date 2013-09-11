var socket = io.connect('http://localhost:3000');
socket.on('connect', function (data) {
  console.log('connect');
  console.log(data);
  $('#chat-content').html("");
  $('.status').html('conectado');
  $('.status').removeClass("text-danger").addClass("text-success");
  $('#input-name').prop('disabled', false);
  $('#input-message').prop('disabled', false);
  $('#send').removeClass('disabled').addClass('btn-primary');
});

socket.on('disconnect', function (data) {
  console.log('disconnect');
  console.log(data);
  $('.status').html('desconectado');
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
