// Get dependencies
var express = require('express');
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

// import the routing file to handle the default (index) route
var index = require('./server/routes/app');
var documents = require('./server/routes/documents');
var messages = require('./server/routes/messages');
var contacts = require('./server/routes/contacts');

var app = express(); // create an instance of express

// Tell express to use the following parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

app.use(logger('dev')); // Tell express to use the Morgan logger

// Add support for CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

// Tell express to use the specified director as the
// root directory for your web site
app.use(express.static(path.join(__dirname, 'cms/wdd430')));

// establish a connection to the mongo database
mongoose.connect('mongodb://localhost:27017/cms')
  .then(() => {
    console.log('Connected to database!');
  })
  .catch((err) => {
    console.log('Connection failed: ' + err);
  });

// Tell express to map the default route ('/') to the index route
app.use('/', index);
app.use('/api/documents', documents);
app.use('/api/messages', messages);
app.use('/api/contacts', contacts);

// Tell express to map all other non-defined routes back to the index page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/cms/index.html'));
});

// Define the port address and tell express to use this port
const port = process.env.PORT || '3000';
app.set('port', port);

// Create HTTP server.
const server = http.createServer(app);

// Tell the server to start listening on the provided port
server.listen(port, function() {
  console.log('API running on localhost: ' + port);
  console.log('Server URLs:');
  console.log('  Main App: http://localhost:' + port);
  console.log('  Documents API: http://localhost:' + port + '/api/documents');
  console.log('  Messages API: http://localhost:' + port + '/api/messages');
  console.log('  Contacts API: http://localhost:' + port + '/api/contacts');
});
