/**
 * Assign group users group assit role
 *
 * @param {Express} app
 * @param {*} db
 * @param {DBoperation} DBoperation
 */
module.exports = (app, db, DBoperation) => {
  app.post('/editGroupUserRole', async (req, res)=>{
    // initialise variables
    let users = req.body.users;
    // get group user list
    const grpUserCollection = db.collection('GroupUser');
    // update group assist role
    await DBoperation.forEachData(users, async (name) => {
      await grpUserCollection.updateOne({$and: [{ groupName: req.body.groupName }, { userName: name }]}, {$set: {groupAssist: true}});
    });

    // get new group user list
    let grpUserArray = await grpUserCollection.find({groupName: req.body.groupName}).toArray();
    res.send(grpUserArray);
  });
  
}