/**
 * Get channel detail for given group name and channel name
 *
 * @param {Express} app
 * @param {MongoClient} MongoClient
 * @param {string} mongoUrl
 * @param {string} dbName
 * @param {string} colName
 */
module.exports = (app, MongoClient, mongoUrl, dbName, colName) => {
  app.post('/channelDetail',(req, res)=>{
    MongoClient.connect(mongoUrl, {poolSize: 10, useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
      // print the error if connection fail
      if (err) {
        return console.log(err);
      }
      const db = client.db(dbName);
      const collection = db.collection(colName);
      // get channel detail
      collection.find({$and: [{ channelName: req.body.channelName }, { groupBelong: req.body.groupName }]}).toArray((toArrayError, data) => {
        // print the error if toArray fail
        if (toArrayError) { return console.log(toArrayError); }
        res.send(data[0]);
      });
    });
  });
  
}