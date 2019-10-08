/**
 * Get Channel List from a group
 *
* @param {Express} app
 * @param {*} db
 * @param {string} colName
 */
module.exports = (app, db, colName) => {
  app.post('/channelList', async (req, res) => {
    const collection = db.collection(colName);
    const count = await collection.find({groupBelong: req.body.groupName}).count();
    // if no channel, send empty list to client
    if (count == 0){
      res.send([]);
      return;
    }
    // get channel list
    const data = await collection.find({groupBelong: req.body.groupName}).toArray();
    res.send(data);
  });
  
}