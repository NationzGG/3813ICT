/**
 * Get user list from database
 *
 * @param {Express} app
 * @param {MongoClient} MongoClient
 * @param {string} mongoUrl
 * @param {string} dbName
 * @param {string} colName
 */
module.exports = (app, MongoClient, mongoUrl, dbName, colName) => {
  app.get('/users', (req, res) => {
    // connect to database
    MongoClient.connect(mongoUrl, {poolSize: 10, useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
      // print the error if connection fail
      if (err) {
        return console.log(err);
      }

      const db = client.db(dbName);
      const collection = db.collection(colName);
      // get user list
      collection.find({}).toArray((err, data) => {
        if (err) {
          console.log(err);
          return err;
        }
        res.send(data);
      });
    });
  });
}
