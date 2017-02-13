/**
 * Libraries
 **/
var http = require('http');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

/**
 * Initializes libraries for use
 **/
var app = express();
var server = http.createServer(app);

//Middlewares for parsing HTTP body (used in POST requests)
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//All requests to files in '/public' are handled by this middleware
app.use(express.static(path.resolve(__dirname, 'public')));

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", () => {
  var addr = server.address();
  console.log("Tutorial server listening at", addr.address + ":" + addr.port);
});