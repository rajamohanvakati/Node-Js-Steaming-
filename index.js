var express = require('express');
var nforce = require('nforce');
var path = require('path');
var app = express();

var server = require('http').Server(app);
// attach socket.io and listen
var io = require('socket.io')(server);

var config = require('./Auth/auth.js');
var sfConn = nforce.createConnection({
  clientId: config.CLIENT_ID, //Connected app clientId
  clientSecret: config.CLIENT_SECRET, // Connected app clientSecret
  redirectUri: config.CALLBACK_URL + '/oauth/_callback', // call back URL
  environment: config.ENVIRONMENT // optional, sandbox or production, production default
});
sfConn.authenticate({
  username: config.USERNAME, //  salesforce User name
  password: config.PASSWORD // Salesforce password
}, function(error, oauth) {
  if (error) return console.log(error);
  if (!error) {
    console.log('*** Successfully connected to Salesforce ***');
  }
  var streamingConnect = sfConn.stream({
    topic: config.PUSH_TOPIC,
    oauth: oauth
  });
  streamingConnect.on('connect', function() {
    console.log('Connected to pushtopic: ' + config.PUSH_TOPIC);
  });
  streamingConnect.on('error', function(error) {
    console.log('Error received from pushtopic: ' + error);
  });
  streamingConnect.on('data', function(data) {
    console.log('Received the following from pushtopic:');
    console.log(data);
    io.sockets.emit('records', data);
    console.log('after sent to emilt');

  });
});
app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', function(req, res) {
  res.render('index');

})

server.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get(
    'port'), app.get('env'));
});
