const Channel = require('../../model/channel.js'); 

//Add channel to database
module.exports = (app, db, colName, result) => {
  app.post('/addChannel', async (req, res) =>{
    //Initialise variables
    let channel = new Channel(req.body[0].channelName, req.body[0].groupBelong);
    const newGroupChannelList = req.body[1];
    const channelCollection = db.collection(colName);
    const groupCollection = db.collection('Group');

    //Check if channel already exist in the group
    const groupData = await groupCollection.find({groupName: channel.groupBelong}).toArray();
    const channelList = groupData[0].groupChannel;
    const i = channelList.findIndex(item => ((item == channel.channelName)));
    if (i != -1){
      result.msg = 'channel already exist';
      res.send(result);
      return;
    }

    //Insert new channel into database
    await channelCollection.insertOne(channel);

    //Update group data in Group collection
    await groupCollection.updateOne({groupName: channel.groupBelong}, {$set: {groupChannel: newGroupChannelList}});
    result.setResult(true, 'New channel successfully created');
    res.send(result);
    result.resetResult();
  });
  

}