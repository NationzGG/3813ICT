/**
 * remove user data from database
 *
 * @param {Express} app
 * @param {*} db
 * @param {string} colName
 * @param {DBoperation} DBoperation
 */
module.exports = (app, db, colName, DBoperation) => {
  app.post('/removeUser', async (req, res) => {
    // initialise varibles
    const userCollection = db.collection(colName),
          groupCollection = db.collection('Group'),
          chUsrCollection = db.collection('ChannelUser'),
          grpUserCollection = db.collection('GroupUser'),
          channelCollection = db.collection('Channel');
    // check user adminGroupList
    const userArray = await userCollection.find({userName: req.body.userName}).toArray();
    const user = userArray[0];
    const adminGroupList = user.adminGroupList;
    const groupList = user.groupList;
    // if list not empty, loop through list, change groupOwner to null
    if (adminGroupList.length != 0) {
      await DBoperation.forEachData(adminGroupList, async(name) => {
        await groupCollection.updateOne({groupName: item}, {$set: {groupOwner: null}});
      });
    }
    // check user groupList
    // if list not empty, loop through list
    if (groupList.length != 0 ) {
      // update channel user list
      await DBoperation.forEachData(groupList, async (name) => {
        const groupArray = await groupCollection.find({groupName: name}).toArray();
        const group = groupArray[0];
        const channelList = group.groupChannel;
        // for each group, check if have channel
        if( channelList.length != 0) {
          // for each channel
          await DBoperation.forEachData(channelList, async(chName) => {
            await chUsrCollection.deleteOne({groupName: name, channelName: chName, userName: user.userName});
          });
        }
        await grpUserCollection.deleteOne({groupName: name, userName: user.userName});
      });
      
    }
    
    // remove user
    await userCollection.deleteOne({userName: req.body.userName});

    // send new user list back to front
    const newUserList = await userCollection.find({}).toArray();
    res.send(newUserList);
  });
}
