/**
 * Get user detail for given username
 *
 * @param {Express} app
 * @param {MongoClient} MongoClient
 * @param {string} mongoUrl
 * @param {string} dbName
 * @param {string} colName
 */
module.exports = (app, MongoClient, mongoUrl, dbName, colName) => {
  app.post('/userDetail', (req, res) =>{
    MongoClient.connect(mongoUrl, {poolSize: 10, useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
      // print the error if connection fail
      if (err) { return console.log(err); }

      const db = client.db(dbName);
      const collection = db.collection(colName);
      // get user detail
      collection.find({userName: req.body.userName}).toArray((toArrayError, data) => {
        // print the error if toArray fail
        if (toArrayError) { return console.log(toArrayError); }
        res.send(data[0]);
      });
    });
  });
}