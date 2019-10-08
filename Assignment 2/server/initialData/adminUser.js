//Model
const User = require('../model/user.js');
const Result = require('../model/result.js');

//Initialise Admin user when a new database is created
module.exports = (MongoClient, mongoUrl, dbName, callback) => {
    //Connect to database
    MongoClient.connect(mongoUrl, {poolSize: 10, useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
        //Print an error if connection fails
        if (err) {
            return console.log(err);
        }
        //Variables
        const db = client.db(dbName);
        const collection = db.collection('User');
        const adminUser = new User('Admin', 'Admin@Admin.com', 'Admin', '', false, true, true, [], []);
        //check if Admin user already exist
        collection.find({userName: 'Admin'}).count((err, count) => {
            //If Admin user does not exist, create one
            if (count < 1) {
                collection.insertOne(adminUser, (err)=>{
                    if (err) {
                        console.log(err);
                    }
                    //Successfully created Admin
                    const result = new Result(true, 'Admin profile has been successfully created');
                    callback(result);
                    client.close();
                });
            } else {
              const result = new Result(false, 'Admin profile already exists');
              callback(result);
              client.close();
            }
        });
    });
}
