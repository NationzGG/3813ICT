/**
 * Add user or remove user from a channel and update the database
 *
 * @param {Express} app
 * @param {*} db
 * @param {DBoperation} DBoperation
 */
module.exports = (app, db, DBoperation) => {
  app.post('/editChannelUser', async (req, res) => {
    // initialise variables
    const chUsrCollection = db.collection('ChannelUser');
    let addednewUsers = req.body.addednewUsers;
    let removedUsers = req.body.removedUsers;

    // check if is undefined - when test with chai, empty array becomes undefined
    if (addednewUsers == undefined) {
      addednewUsers = [];
    }
    if (removedUsers == undefined) {
      removedUsers = [];
    }

    // determin is add or remove
    if(addednewUsers.length != 0) {
      // add user
      await chUsrCollection.insertMany(addednewUsers);
    } else if (removedUsers.length != 0) {
      // remove user
      await DBoperation.forEachData(removedUsers, async(data) => {
        await chUsrCollection.deleteOne({groupName: req.body.groupName, channelName: req.body.channelName, userName: data.userName});
      });
    }

    // get new list
    const newList = await chUsrCollection.find({$and: [{ channelName: req.body.channelName }, { groupName: req.body.groupName }]}).toArray();
    res.send(newList);
  });
}
