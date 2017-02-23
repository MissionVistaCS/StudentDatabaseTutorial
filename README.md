## What are we doing?

We are building a web application to manage a simple database of students. We will use HTML forms and EJS to return data to the client.
In the next tutorial, we'll build the same application, but using the Angular framework.

## Prerequisities

Understand the basics of Express, POST requests, and MongoDB.

## Tutorial

Run `npm install`.
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

### Part 2: Saving students into Mongo
Before we start, open a terminal/console window and run `mongod`. Then, open another terminal/console window and type `mongo` followed by `use student-database`.

MongoDB is the NoSQL database we'll be using. To connect to the database from NodeJS, we use the Mongoose module.

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

and establish a connection to the database under that (make sure Mongo is running using the mongod command and that you have a database named "student-database"):

```
mongoose.connect('mongodb://localhost:27017/student-database');
```

Now we will change the POST request function to this:

```
app.post('/submit', function(req, res) {
    var name = req.body.name; //Stores name
    var age = req.body.age; //Stores age
    var email = req.body.email; //Stores email
    console.log('POST: Name: ' + name + '. Age: ' + age + '. Email: ' + email + '.');

    var newStudent = new Student({ name: name, age: age, email: email });
    newStudent.save(function() {
        console.log('Saved a new student');
        return res.redirect('/');
    });
});
```

On form submission, a new Student object is created and then saved in the database. When it is finished saving, the callback function is executed, "Saved a new student" is printed, and the client is redirected.

You should see the new student documents in the Mongo database. Next, we will display these documents on the page using EJS.

### Part 3: Displaying students

#### Switching over to EJS
Currently, we are serving a static HTML file to the client when it GETs '/'. We will move to EJS, which allows the server to dynamically alter the HTML before sending it to the client.

First, rename 'index.html' to 'index.ejs' and 'public' to 'views' (this is the common convention). Now, in 'app.js', erase the line `app.use(express.static(path.resolve(__dirname, 'public')));`
and replace it with `app.get('/', function(req, res) { return res.render('index'); });`. Now, near the top of the file, and under the declaration of `app`, paste:
```
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
```
This sets our view engine to EJS and our views directory to 'views'.

#### Passing data into index.ejs
Inside our app.get() callback function, we're going to perform a database search and return all the results to 'index.ejs':
```
app.get('/', function(req, res) { 
    Student.find({}, function(err, results) {
        if (err) return console.log(JSON.stringify(err));
        return res.render('index', { students: results });
    });
});
```

#### Displaying students
Now, open 'index.ejs'. Underneath the form, create an unordered list (`<ul>` tags). Inside the list, paste this:
```
<% students.forEach(function(student) { %>
            <li>Name: <%= student.name %>. Age: <%= student.age %>. Email: <%= student.email %></li>
<% }); %>
```
Before this file is sent to the client, EJS will evaluate the javascript enclosed by the `<%%>` tags.
