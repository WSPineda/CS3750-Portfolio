const {MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.ATLAS_URI

let _db;
module.exports = {
    connectToServer: function(callback){
        console.log("Attempting to connect");
    const client = new MongoClient(uri, {
        serverApi:{
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });


    async function run(){
        try{
            await client.connect();
            await client.db("admin").command({  ping:1  });
            console.log("Pinged your deployment. You succesfully connected to MongoDB!");
            _db = client.db("employees");
            console.log("Succesfully connected to employees collection.")

        } finally {
            //console.log("Closing the client.");
            //await client.close();
        }
    }

    run().catch(console.dir);
    },

    getDb: function(){
        return _db;
    }
};