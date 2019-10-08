/**
 * Add user or remove user from a group and update the database
 *
 * @param {Express} app
 * @param {*} db
 * @param {DBOperation} DBoperation
 * @param {Result} result
 */
module.exports = (app, db, DBoperation, result) => {
  app.post('/editGroupUser', async (req, res) => {
    // initialise variables
    const grpUsrCollection = db.collection('GroupUser');
    const userCollection = db.collection('User');
    let addednewUsers = req.body.addednewUsers;
    let removedUsers = req.body.removedUsers;

    // check if is undefined - when test with chai, empty array becomes undefined
    if (addednewUsers == undefined){
      addednewUsers = [];
    }
    if (removedUsers == undefined) {
      removedUsers = [];
    }

    // determin is add or remove
    if(addednewUsers.length != 0) {
      // add user
      await grpUsrCollection.insertMany(addednewUsers);
    } else if (removedUsers.length != 0) {
      // remove user
      await DBoperation.forEachData(removedUsers, async (data) => {
        await grpUsrCollection.deleteOne({groupName: req.body.groupName, userName: data.userName});
      });
    }
    
    // update user table data
    const queryFind = { userName: '' };
    const queryUpdate = { groupList: [] };
    // if addednewUser list provided, then is add user to group
    if (addednewUsers.length != 0){
      const usrList = [];
      addednewUsers.forEach(item => {
        usrList.push(item.userName);
      });
      await DBoperation.updateMany(usrList, userCollection, queryFind, queryUpdate, req.body.groupName, 'add');
    } else if (removedUsers.length != 0) {
      const usrList = [];
      removedUsers.forEach(item => {
        usrList.push(item.userName);
      });
     
      // if is removedUsers list provided, which means remove user from group
      await DBoperation.updateMany(usrList, userCollection, queryFind, queryUpdate, req.body.groupName, 'remove');
    } else {
      // must be one of the list, both list should not be empty because front end will not allow empty list to pass through.
      result.msg = 'faild, something went wrong';
      res.send(result);
      result.resetResult();
      return;
    }

    // get new list
    const newGroupUserList = await grpUsrCollection.find({groupName: req.body.groupName}).toArray();
    res.send(newGroupUserList);
  });
}
