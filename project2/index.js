const express = require('express');
const myCustomRoutes = require('./routes/user');
const myCustomRoutes2 = require('./routes/listofentries');
const myCustomRoutes3 = require('./routes/specificfood');


const app  = express();
const port = 3000; // Specify the port 




app.use("/user_routes/", myCustomRoutes);
app.use("/entry_list/", myCustomRoutes2);
app.use("/specific_food/", myCustomRoutes3);


app.get("/",(req,res)=>{
    res.send("Hello, World!");

});

app.use(express.static('public'));

app.listen(port,()=>{
    console.log("Server started on port " + port);
});