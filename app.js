
//app entry point

// load the express-js module
var express = require('express');

// instantiate the express module
var app = express();

// load our routes for the webapi and set up routes based on this path -- /api/contacts
// Note: in terms of mvc pattern, expressjs routing modules are the controllers

// var routingEngine = require('./app_modules/routes/contacts-controller')
// var routingEngine = require('./app_modules/routes/pizza-controller')
var routingEngine = require('./app_modules/controllers/students-controller')


// contacts_api_root = '/api/contacts'
// pizza_api_root = '/api/toppings'
students_api_root = '/api/student'


// pick api endpoint
api_root = students_api_root

port = 3500
app.use(api_root, routingEngine);

var server = app.listen(port,
 	function(){
			console.log('');			
			console.log('Server started on : ' + 'http://localhost:' + server.address().port + api_root);
});
