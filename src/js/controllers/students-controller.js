const express = require('express');
const routingEngine =  express.Router();


// load our test data to be served by the service
const moduleStudentsService = require('../services/StudentsService');

var moduleCommon = require('../common/CommonLib');
const CommonLib = require('../common/CommonLib');

const studentsService = new moduleStudentsService.StudentsService();
console.log(studentsService.getWelcome());


const STUDENTS_API_LOCATION =  "http://localhost:3500/api/student";

///////////////////////////////////////////////////////////////////////
// start intercepting requests and serve
//////////////////////////////////////////////////////////////////////


// middleware to intercept all requests and print time
// an example of how to intercept request before they are fulfilled
routingEngine.use(function timeLog(request, response, nextRoute) {
	console.log(new Date() + " - " + request.originalUrl);
	nextRoute();
})

// response to requests to serve home page
// e.g. api/student
routingEngine.get('/', function(request, response)
{
	response.send( {"message": "Welcome to my simple Node WebApi Service"} );
})


// request to find a single student
// e.g. api/student/100 where 100 is the ID
routingEngine.get('/:id(\\d+)', function(req, resp){	
	// attempt to find the item from the service
	let  item = {};
	try{
		item  = studentsService.getItemById(req.params.id);
	}catch(ex){
		resp.status(500).send({
				status_code:500, 
				message_code: "MSG_CODE_INTERNAL_SERVER_ERROR", 
				message: "something went wrong, but don't worry, we've informed the tech guys to look into it."
			});
	}

	// if item is found, add metadata and create final response to send to client
   if (item != null){
		let finalResponse = {};
		try{
			finalResponse = moduleCommon.addApiMetadataForSingleItem(item, STUDENTS_API_LOCATION);
		}catch(ex){
			resp.status(500).send({
					status_code:500, 
					message_code: "MSG_CODE_INTERNAL_SERVER_WRONGDOING", 
					message: "ok, I admit, the code is doing its own thing, I will fix it."
				}
			);}
		resp.send(finalResponse);
 	}else{
 		console.log("student " + req.params.id + " not found.");
		 resp.status(404).send({
				status_code:404, 
				message_code: "MSG_CODE_ITEM_NOT_FOUND", 
				message: "no item matched the id specified."
			});
 	}	
});

// request to list a all students
// e.g. api/student/list
routingEngine.get('/list', function(req, resp)
{
	// perform url validation before redirecting

	// redirect to the url you would like the user to use
	resp.redirect('/api/student/list/page/1');
})


// request to list a all students
// e.g. api/student/list
routingEngine.get('/list/page/:page(\\d+)', function(req, resp)
{
	let students = studentsService.getAllItems();

	if (students==null || students.length==0)
	{
		resp.status(404).send(
			{
				status_code:404, 
				message_code: "MSG_CODE_NO_ITEMS_FOUND", 
				message: "no items were found."
			}
		);
	}

	// add metadata to the student object and create a final response to send the client
	let finalResponse = moduleCommon.addApiMetadataForList(
		apiResult=students, 
		apiLocation=STUDENTS_API_LOCATION, 
		requestObj=req, 
		nextRequestUrl=moduleCommon.DEFAULT_LIST_PAGINATION,  
		request_description="list of students (paginated)");

	resp.send( finalResponse);
})


// request to list a all students with certain status
//  list active students:
//  	curl http://localhost:3500/api/student/status/1
//
//  //  list inactive students:
//  	curl http://localhost:3500/api/student/status/0
routingEngine.get('/status/:status(\\d+)', function(req, resp)
{
	// perform url validation before redirecting

	// redirect to the url you would like the user to use
	let url = req.originalUrl + '/page/1';
	resp.redirect(url);
})


// request to list all students with certain status, with pagination
//
//  list page 1 of all active students:
//		curl http://localhost:3500/api/student/status/1/page/1
//
//  list page 1 of all inactive students:
//  	curl http://localhost:3500/api/student/status/0/page/1
routingEngine.get('/status/:status(\\d+)/page/:page(\\d+)', function(req, resp)
{
	var students = studentsService.getItemByStatus(req.params.status);
	if (students==null || students.length==0)
	{
		resp.status(404).send({status:404, message: "no items found"});
	}
	resp.send(moduleCommon.addApiMetadataForList(students,STUDENTS_API_LOCATION,  req, moduleCommon.STUDENT_STATUS_LIST_PAGINATION, "list of students with specific status (paginated)"));
})

module.exports=routingEngine