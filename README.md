## What are we doing?

We are building a web application to manage a simple database of students. We will use HTML forms and EJS to return data to the client.
In the next tutorial, we'll build the same application, but using the Angular framework.

## Prerequisities

Understand the basics of Express, POST requests, and MongoDB.

## Tutorial

### Part 1: Form Submissions
Add 

```
app.post('/submit', function(req, res) {
    
});
```
to app.js anywhere after the body parser middleware. This routes all POST requests to '/submit' through this function.

Next, we need to get the variables inside the HTTP body. These are stored inside `req.body`. So, we just add a few lines to the middleware to get the name, age, and email:
```
var name = req.body.name; //Stores name
var age = req.body.age; //Stores age
var email = req.body.email; //Stores email
```
To test this POST middleware, add `console.log('POST: Name: ' + name + '. Age: ' + age + '. Email: ' + email + '.')` after the code above. Now, when you start the server and press 'submit', the console should log the parameters you submitted.

But there's a problem. After clicking the submit button, the browser hangs. To fix this, simply redirect the client to the home page. Add `return res.redirect('')` to the end of the middleware. The entire submit route should now look like this:

```
app.post('/submit', function(req, res) {
    var name = req.body.name; //Stores name
    var age = req.body.age; //Stores age
    var email = req.body.email; //Stores email
    console.log('POST: Name: ' + name + '. Age: ' + age + '. Email: ' + email + '.');

    return res.redirect('/');
});
```

Now that we're done with the first part, it's time to implement a database using MongoDB and Mongoose.

### Part 2: MongoDB and Mongoose

MongoDB is the NoSQL database we'll be using. To connect to the database from NodeJS, we use the Mongoose module. To install Mongoose, run `npm install --save mongoose` in the project's directory.

Create a new file, named 'student.js', and add `var mongoose = require('mongoose');` to the top of the file. Now, we need to create a model of our database:

```
var studentSchema = new mongoose.Schema({
	name: String,
    age: Number,
    email: String
}, { collection: "students" });
var Student = mongoose.model("Student", studentSchema);
```

And add to exports:

```
module.exports = Student;
```

Now, in 'app.js', we will require 'mongoose' and 'student.js' at the top of the file:

```
var mongoose = require('mongoose');
var Student = require('./student');
```

and establish a connection to the database under that (make sure Mongo is running using the mongod command):

```
mongoose.connect('mongodb://localhost:27017/student-database');
```
