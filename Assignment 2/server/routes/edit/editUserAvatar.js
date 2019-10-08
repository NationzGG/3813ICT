/**
 * Update user avatar
 *
 * @param {Express} app
 * @param {*} db
 * @param {string} colName
 */
module.exports = (app, db, colName) => {
  app.post('/edituserAvatar', async (req, res) => {
    // initialise variables
    const userCollection = db.collection(colName);
    const grpUserCollection = db.collection('GroupUser');
    const chUserCollection = db.collection('ChannelUser');
    // update avatr in user
    await userCollection.updateOne({userName: req.body.userName}, {$set: {userAvatar: req.body.userAvatar}});
    // update avatar in groupUser
    await grpUserCollection.updateMany({userName: req.body.userName}, {$set: {userAvatar: req.body.userAvatar}});
    // update avatar in channelUser
    await chUserCollection.updateMany({userName: req.body.userName}, {$set: {userAvatar: req.body.userAvatar}});
    
    // get new user detail
    const userArray = await userCollection.find({userName: req.body.userName}).toArray();
    res.send(userArray[0]);
  });
}
