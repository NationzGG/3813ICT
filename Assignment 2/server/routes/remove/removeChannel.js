/**
 * remove channel data from database
 *
 * @param {Express} app
 * @param {*} db
 * @param {string} colName
 * @param {Result} result
 */
module.exports = (app, db, colName, result) => {
  app.post('/removeChannel', async (req, res) => {
    // initialise variables
    const channelCollection = db.collection(colName);
    const groupCollection = db.collection('Group');
    const chatCollection = db.collection('ChatHistory');
    const chUsrCollection = db.collection('ChannelUser');

    // remove all the chat history for that channel and group
    await chatCollection.deleteMany({ channelName: req.body.channelName, groupBelong: req.body.groupName });
    // remove all the user from the channel
    await chUsrCollection.deleteMany({ channelName: req.body.channelName, groupName: req.body.groupName });
    // remove channel name from group channelList
    const groupArray = await groupCollection.find({groupName: req.body.groupName}).toArray();
    const channelList = groupArray[0].groupChannel;
    channelList.forEach((name, index) => {
      if (name == req.body.channelName) {
        channelList.splice(index, 1);
      }
    });
    // update group data
    await groupCollection.updateOne({groupName: req.body.groupName}, {$set: {groupChannel: channelList}});
    // remove channel
    await channelCollection.deleteOne({ channelName: req.body.channelName, groupBelong: req.body.groupName });

    result.setResult(true, 'channel removed');
    res.send(result);
    result.resetResult();
  });
}
