console.log('records before ');

var url = window.location.href.split("/");
var socket = io.connect(url[0] + "//" + url[2]);
console.log('records');
socket.on('records', function(data) {
  var results = JSON.parse(data);
  console.log(results);
  $('<div>Account Receieved: ' + results['sobject']['Name'] + '</div>').prependTo(
    '#messages');
})
