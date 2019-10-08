/**
 * get channel user list
 *
 * @param {Express} app
 * @param {*} db
 */
module.exports = (app, db) => {
  app.post('/channelUserList', async (req, res) => {
    const collection = db.collection('ChannelUser');
    const count = await collection.find({$and: [{ channelName: req.body.channelName }, { groupName: req.body.groupName }]}).count();
    // if no user, send empty list
    if (count == 0){
      res.send([]);
      return;
    }
    // get channle user list
    const data = await collection.find({$and: [{ channelName: req.body.channelName }, { groupName: req.body.groupName }]}).toArray();
    res.send(data);
  });
  
}