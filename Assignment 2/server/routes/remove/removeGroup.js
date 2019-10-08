/**
 * remove group data from database
 *
 * @param {Express} app
 * @param {*} db
 * @param {string} colName
 * @param {DBoperation} DBoperation
 */
module.exports = (app, db, colName, DBoperation) => {
  app.post('/removeGroup', async (req, res) => {
    // initialise varibles
    const groupCollection = db.collection(colName);
    const grpUsrCollection = db.collection('GroupUser');
    const userCollection = db.collection('User');
    const channelCollection = db.collection('Channel');
    const chatCollection = db.collection('ChatHistory');
    // get current group data
    const groupArray = await groupCollection.find({groupName: req.body.groupName}).toArray();
    const groupData = groupArray[0];
    // get group user data
    const groupUserList = await grpUsrCollection.find({groupName: req.body.groupName}).toArray();

    // remove from adminGroupList
    if (groupData.groupOwner != null) {
      const groupOwner = await userCollection.find({userName: groupData.groupOwner}).toArray();
      const newAdminGroup = groupOwner[0].adminGroupList;
      newAdminGroup.forEach((name, index) => {
        if (name == groupData.groupName) {
          newAdminGroup.splice(index, 1);
        }
      });
      // update Admin group list
      await userCollection.updateOne({userName: groupData.groupOwner}, {$set: {adminGroupList: newAdminGroup}})
    }
    
    // update other users group list
    if (groupUserList.length != 0) {
      const queryFind = { userName: '' };
      const queryUpdate = { groupList: [] };
      const list = [];
      groupUserList.forEach(item => {
        list.push(item.userName);
      });
      await DBoperation.updateMany(list, userCollection, queryFind, queryUpdate, groupData.groupName, 'remove');
    }

    // remove all channels and chat history that belongs to the group
    const channelArray = await channelCollection.find({ groupBelong: req.body.groupName }).toArray();
    if (channelArray.length != 0) {
      // check if there is any history in the channel and remove them if exists.
      DBoperation.forEachData(channelArray, async (channel) => {
        const chatHistory = await chatCollection.find({$and: [{ channelName: channel.channelName }, { groupBelong: req.body.groupName }]}).toArray();
        // remove all the history data
        if (chatHistory.length != 0) {
          await chatCollection.deleteMany({ channelName: channel.channelName, groupBelong: req.body.groupName });
        }
      });
      await channelCollection.deleteMany({groupBelong: req.body.groupName});
    }
    // remove groupUser
    await grpUsrCollection.deleteMany({groupName: req.body.groupName});
    // remove group
    await groupCollection.deleteOne({groupName: req.body.groupName});

    // send new list
    const newGroupList = await groupCollection.find({}).toArray();
    res.send(newGroupList);
  });
}
