const express = require('express');
const myCustomRoutes = require('./routes/user');

// Load express
const app = express();
const port = 3000;

// Routes in /route/user
// localhost:3000/user_routes
app.use("/user_routes/", myCustomRoutes);


//routes in this file 
//localhost:3000/ <- index page
app.get("/", (req,res) => {
res.send("Hello, World!");

});


//You can go to any page in the public folder
//localhost:3000/userinput.html
app.use(express.static('public'));


app.listen(port,() =>{
    console.log("Server started on port " + port);

});