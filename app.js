
//app entry point

// load the express-js module
const express = require('express');

// instantiate the express module
const app = express();

const swaggerUi = require('swagger-ui-express');
const yamlModule = require('yamljs')
const swaggerDocument = yamlModule.load('./app_modules/open_api_definitions/swagger.yaml');

// load our routes for the webapi and set up routes based on this path
// Note: in terms of mvc pattern, expressjs routing modules are the controllers
const routingEngine = require('./app_modules/controllers/students-controller')

const my_server = 'http://localhost:';
const port = 3500;

// setup api endpoint and routing
students_api_root = '/api/student'
api_root = students_api_root

app.use(api_root, routingEngine);

const server = app.listen(port,
 	function(){
			console.log('');			
			console.log('Server started on : ' + my_server + server.address().port + api_root);
});
