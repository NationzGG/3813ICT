//Model
const Result = require('../model/result.js');
//Delete Database
module.exports = (MongoClient, mongoUrl, dbName, callback)=>{
  //Connect to database
  MongoClient.connect(mongoUrl, {poolSize: 10, useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
      //Print the error if connection fail
      if (err) {
        console.log('Connection failed');
        console.log(err);
        return err;
      }
      //Variables
      const db = client.db(dbName);
      //Drop databse
      db.dropDatabase((err2) => {
        if (err2) {
          console.log('Cant drop database');
          console.log(err2);
          return err;
        } else {
          const result = new Result(true, 'drop database success');
          callback(result);
        }
      });
      client.close();
  });
}