const express = require("express");
 
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");
 
// This helps convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

 //Retrieve all accounts minus the password
recordRoutes.route("/record").get(async (req, res) => {
    try{
        let db_connect = dbo.getDb("employees");
        const result = await db_connect.collection("records").find({}, { projection: { password: 0 } }).toArray(); //This line prevents the password from showing up
        res.json(result);
    }
    catch(err){
        throw err;
    }
});

 //Registration
recordRoutes.route("/record/register").post(async (req, res) =>{
    try{

        let db_connect = dbo.getDb();
        let myobj = {
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
            role: '',
            savings: 0,
            checking: 0,
        };
        let email = myobj.email;
        const existingUser = await db_connect.collection("records").findOne({email});
        if(existingUser){
            return res.status(400).json({msg: 'User already exists'});
        }

        const result = await db_connect.collection("records").insertOne(myobj);
        res.json(result);
        }
        catch(err){
            throw err;
        }
    });




//Authentication / Signin
recordRoutes.route("/record/signin").post(async (req, res) =>{
    try{
        let db_connect = dbo.getDb();
        let {email, password} = req.body;
        const user = await db_connect.collection("records").findOne({email});
        if (!user || user.password !== password) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        else{
            return res.status(200).json({msg: 'User found!'});
        }
    }
    catch(err){
        throw err;
    }
});



 
//Retrieves one account based on the email minus the password
recordRoutes.route("/record/:email").get(async (req, res) => {
    try{
        let db_connect = dbo.getDb();
        //let myquery = { email: new ObjectId(req.params.email) };
        const result = await db_connect.collection("records").findOne({ email: req.params.email }, { projection: { password: 0 } });
        res.json(result);
    }
    catch(err){
        throw err;
    }
});

//Updates a user account related to one of three roles : customer, manager, administrator.
recordRoutes.route("/record/update/:email").post(async (req,res) =>{
    try{
        let db_connect = dbo.getDb();
        const {role} = req.body;
        const result = await db_connect.collection("records").updateOne({ email: req.params.email }, { $set: { role } });
        if (result.matchedCount === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json({ msg: 'User role updated successfully' });
    }
    catch(err){
        
        throw err;
    }



});

//Allows us to deposit money from either checking or savings
recordRoutes.route("/record/deposit").post(async (req,res) =>{
    try{
        let db_connect = dbo.getDb();
        
        const { email, accountType, amount } = req.body;
        if(parseInt(amount) > 0 ){

            //Checks the account type - if checking then increases the checking amount, if false, then increases savings
            const update = accountType === 'checking' ? { $inc: { checking: parseInt(amount) } } : { $inc: { savings: parseInt(amount) } };
            const result = await db_connect.collection("records").updateOne({ email }, update);
        
        
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json({ msg: 'Deposit successful' });
        }

        
    }
    catch(err){
        
        throw err;
    }



});

//Allows us to withdraw money from either checking or savings
recordRoutes.route("/record/withdraw").post(async (req,res) =>{
    try{
        let db_connect = dbo.getDb();
        const { email, accountType, amount } = req.body;
        const user = await db_connect.collection("records").findOne({ email });
        //If there's no user with that email then return 404
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        if ((accountType === 'checking' && user.checking < amount) || (accountType === 'savings' && user.savings < amount)) {
            return res.status(400).json({ msg: 'Insufficient funds' });
        }
        if (parseInt(amount) < 0) {
            return res.status(400).json({ msg: 'Amount to be withdrawn must be greater than 0' });
        }
        const update = accountType === 'checking' ? { $inc: { checking: -parseInt(amount) } } : { $inc: { savings: -parseInt(amount) } };
        await db_connect.collection("records").updateOne({ email }, update);
        res.json({ msg: 'Withdrawal successful' });


        
    }
    catch(err){
        
        throw err;
    }



});

//Allows us to transfer money from checkings to savings or vice versa
recordRoutes.route("/record/transfer").post(async (req,res) =>{
    try{
        let db_connect = dbo.getDb();
        const { email, fromAccount, toAccount, amount } = req.body;
        const user = await db_connect.collection("records").findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if ((fromAccount === 'checking' && user.checking < amount) || (fromAccount === 'savings' && user.savings < amount)) {
            return res.status(400).json({ msg: 'Insufficient funds' });
        }
        if (parseInt(amount) < 0) {
            return res.status(400).json({ msg: 'Amount to be withdrawn must be greater than 0' });
        }

        

        const updates = fromAccount === 'checking'
            ? [{ $inc: { checking: -parseInt(amount) } }, { $inc: { savings: parseInt(amount) } }]
            : [{ $inc: { savings: -parseInt(amount) } }, { $inc: { checking: parseInt(amount) } }];

        await db_connect.collection("records").updateOne({ email }, updates[0]);
        await db_connect.collection("records").updateOne({ email }, updates[1]);

        res.json({ msg: 'Transfer successful' });


        
    }
    catch(err){
        
        throw err;
    }



});


















 

 






























































// This section will help you update a record by id.
recordRoutes.route("/update/:id").post(async (req, res)=> {
    try{
 let db_connect = dbo.getDb();
 let myquery = { _id: new ObjectId(req.params.id) };
 let newvalues = {
   $set: {
     name: req.body.name,
     position: req.body.position,
     level: req.body.level,
   },
 };
 const result = await db_connect.collection("records").updateOne(myquery, newvalues);
 res.json(result);
}catch(err){
    throw err;
}
});

 
// This section will help you delete a record
recordRoutes.route("/:id").delete(async (req, res) => {
    try{

    
 let db_connect = dbo.getDb();
 let myquery = { _id: new ObjectId(req.params.id) };
 const result = await db_connect.collection("records").deleteOne(myquery);
res.json(result);
}catch(err){
    throw err;
}
});
 
module.exports = recordRoutes;