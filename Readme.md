## credits
In 2019, I watched a video recorded for a webinar by Mark Volkmann of Object Computing (OCI), titled __MODERN JAVASCRIPT TOOLING__. 
The tools, concepts and code presented inspired me to create this project.   

I am not expert in modern javascript, as you will later discover from my javascript code, but my goal is to create a simple javascript application that beginners can use as a starting point for creating dummy apis for rapid prototyping and testing.  

## motivation
### applications have dependencies
Many applications are made up of layers or components, the front end, the backend, the database, etc.
some of the most difficult issues in application development is integrating with all the layers.  

For instance, consider a simple application made up of a web tier consuming data from an backend api. Initially the web tier cannot make much progress because the api is not available.  
  
In some cases the api may be ready but it may be on a remote server and requires connectivity and access tokens. It often turn out that the api is also administered by a different group, and therefore as a consumer you may not be able to create your own test data to use.  
  
### working around dependencies is hard, results in wasted project time
This creates a huge dependency issue that is often difficult  to work around and most developers simply wait till they have something to work with. This results in many wasted hours of development time and pushes all the work to the final weeks of the project.  

In remote work environments where there is often large time differences between clients and developers, teams may encounter issues and not get the right support at the right time.  For remote developers to remain productive they need to learn techniques to reduce development dependencies.  But how does one do that? 

### attempt to remove dependencies are much as possible
The idea is to duplicate the development environment locally as much as possible. With technologies like docker, it is much easier to create such environments locally that it was a few years ago.

For instance, the whole backend api can be dockerized and shared so that developers can run it locally. Another method would be to create a dummy api that serves data similar to what the real api will serve. This gives you, the developer a lot of flexilibity especially when creating test data.  

### this project shows one way to remove a dependency 
This project shows how Node can be used to create a simple dummy api for testing while the actual api is still in development. In order to create a dummy api that resemebles the actual one, we need to define the api endpoints and the schema very quickly during the project. Tools like OpenApi can be very helpful in this case.  
  
Even if developers are not familiar with how to use OpenApi to describe api endpoints, you should be able to use json to create sample data of what is expected from th api.


## scenario - an api serving students data
Let's assume we are developing backend api to serve students data. We have a large number of students in a database and you are building an api to serve that data.
Each student record has the following attributes:

| property      | description |
| ----------- | ----------- |
| FirstName | student first name |
| LastName | student last name |
| DateAdded | date student was added |
| DateAdded | student status 1 is active, 0 is inactive |

## actions we expect the api to allow
For simplicity, we would like the final api to provide three methods. These are listed below:
| property      | description |
| ----------- | ----------- |
| list students | list students, if there are many of students, do not return all at once, we want the api to return a few at a time (paginated list) |
| list students by status| list all students with a given status. e.g. list all active students. Again, we do not return all data at once, we want the api to return a few at a time (paginated list)  |
| find student | find a student wih a given id, e.g. find student with id 100 |


## putting the application together

### 1. create a sample dummy data
The next task is to create sample data using json in the same format that the real api will return. This allows us to create code on front end that works with the data as if it's coming from the real api.

The application will serve hardcoded dummy data (json) via api. The following is part of the sample dummy data to be used.

```json
 [
	{
		"ID": 100, "UniqueID": 
		"FirstName": "John",  
		"LastName": "Bayor",  
		"DateAdded":"2022-09-10", 
		"IsActive": 1
	},
	{ 
		"ID": 101,
		"FirstName": "Marie", 
		"LastName": "Mavais", 
		"DateAdded":"2022-07-15", 
		"IsActive": 1
	}

 ]
```
![app structure](https://github.com/kowusu01/RapidPrototypingWithExpressJs/blob/main/docs/service-with-fake-data.PNG?raw=true)

### 2. define the api endpoint
#### api/student
  

### 3. define the urls and paths with all required parameters
Now define the urls that will be used to access the data. This urls should be the same as the ones the real api will use.
Remember, you don't need the entire api schema to get started. Start by getting the api designer to provide a few of the important endpoints and their schema.  

In this example we will create an api that returns student data. Three methods will be implemented:  
 - list all students (with pagination)
 - find student using an id
 - list students with a given status (with pagination)
 
| req#    |    url      | description |
| ----------- | ----------- | ----------- |
| 1.  |  api/student/list/      | list students with pagination, e.g. _api/student/list/page/1_  |
| 2.  |  api/student/id  | find a student given an id,  e.g. _api/student/100_  |
| 3.  |  api/student/status_id    | list all students with a given status (1 is active, 0 is inactive), e.g. _api/student/status/1_ |
|  |  |  

These three methods could provide the web team something to start with and establish the code for interacting with an api which is going to be needed when the final api is ready.

### 4. write methods in the service to return the dummy data
Next step is to create methods in the service to return data for each route. For instance we need a method that searches in the dummy data and return a record that matches a given id. This exactly what we want to do when we get data from the actual api.   

Below is an example of such method.
![sample service method](https://github.com/kowusu01/RapidPrototypingWithExpressJs/blob/main/docs/service-with-fake-data-and-method.PNG?raw=true)
 
### 5. write methods in the controller to serve the requests
Once you have service methods to return data, and the api routes (paths) are defined, create methods in the controller (expressJs route) to serve the requests.  Each method in the controller calls a method in the service to return the required data, format it and return to the client.  

Below is a sample method that serves request #2 - _find student given an id:  e.g. api/student/100_
![sample route method](https://github.com/kowusu01/RapidPrototypingWithExpressJs/blob/main/docs/sample-route-method.PNG?raw=true)

### 6. set up the http server and serve requests
Node ExpressJs is used as the http server, with the api endpoints designed to mimic the actual api endpoints.  
![sample route method](https://github.com/kowusu01/RapidPrototypingWithExpressJs/blob/main/docs/partial-appjs.PNG?raw=true)

## How the app is constructed

1. the application is made up of four components:
     - **app.js** - application entry point
     - **controller** (students-controller.js) -  to intercept requests from the browser, *expressjs* calls the controllers routers, see **app_modules/controllers**  
     - **services** (StudentsService) - which include methods for serving data. currently the data is hardcoded in the services, and are encapsulated in the controller.
       - the services are TypeScript files and are compiled and copied to the app_modules folder during build
     - **commonLib** - the file contains shared functions used in the controller

2. the **app.js**:
      - the app.js file lives at the root of the project 
      - at runtime, it creates the expressjs object
      - loads the controller, the controller loads the service 
      - starts http server on a selected port
  
3. source and output folders:  
	- all sourfce files are in nthe __src__ folder  
	- when the app builds, it copies all files needed to run the app into the __app_modules__ folder 
	

![app structure](https://github.com/kowusu01/RapidPrototypingWithExpressJs/blob/main/docs/SimpleJsApiStructure.jpg?raw=true)

  
## How to execute the app
note: all commands are executed in the bash terminal
1. execute ` npm update `
2. execute ` npm run build-all `
3. execute 
     ` node app.js `  or     ` npm run start `    or    `nodemon app.js ` 
     
- Note: nodemon is a js package to monitor files so you can edit js files, save and refresh the browser while running
- you may have to manually install nodemon  ( npm install -g nodemon )
- when the app starts, take note of the url : e.g. localhost:8080/api/your-endpoint
- enter the url in a browser to test
- check the code to see where you can customize it
  

## Sample resquests
    
### list students
- http://localhost:3500/api/student/list
- curl http://localhost:3500/api/student/list/page/1

  
### list students with status active (status=1)
- http://localhost:3500/api/student/status/1
- curl http://localhost:3500/api/student/status/1/page/1

  
## Sample responses
In order to make the api features easy to discover and consume, all successful responses will include a meta data section that provides some information about the result. This meta data section helps consumers understand the response and to better act on it.

### single item response
e.g. http://localhost:3500/api/student/100
![single item api response](https://github.com/kowusu01/RapidPrototypingWithExpressJs/blob/main/docs/api-result-single-item.PNG?raw=true)

---  
  
### sample response for a list
e.g. http://localhost:3500/api/student/list/page/1
![list api response](https://github.com/kowusu01/RapidPrototypingWithExpressJs/blob/main/docs/api-result-list.PNG?raw=true)

---   
  
### an example 404 response
![404 api response](https://github.com/kowusu01/RapidPrototypingWithExpressJs/blob/main/docs/api-result-404.PNG?raw=true)

---  


## Packages
- npm
- npm-run-all
- expressJs
- nodemon 
