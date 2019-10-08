//Model
const Group = require('../../model/group.js'); // Group class, create Group object
const GroupUser = require('../../model/groupUser.js')

//Add new group
module.exports = function (app, db, colName, DBoperation, result) {
  app.post('/addGroup', async (req, res) =>{
    //Initialise varibles
    const groupCollection = db.collection(colName);
    const grpUsrCollection = db.collection('GroupUser');
    const userCollection = db.collection('User');
    let group = new Group(req.body[0].groupName, req.body[0].groupChannel, req.body[0].groupOwner);
    let grpUsr = req.body[1];
    
    //Check if is undefined - when test with chai, empty array becomes undefined
    if (req.body[1] == undefined) {
      grpUsr = [];
    }
    if (req.body.groupChannel == undefined) {
      group.groupChannel = [];
    }

    //Check if group already exsist
    let count = await groupCollection.find({groupName: group.groupName}).count();
    if (count > 0) {
      result.msg = 'group already exist';
      res.send(result);
      return result;
    }

    //Add new group
    let insertGroup = await groupCollection.insertOne(group);
    if (grpUsr.length != 0){
      await grpUsrCollection.insertMany(grpUsr);
    }
    
    //Update adminGroupList from user collection
    let ownerUser = await userCollection.find({userName: group.groupOwner}).toArray();
    let newAdminGroupList = ownerUser[0].adminGroupList;
    newAdminGroupList.push(group.groupName);
    await userCollection.updateOne({userName: group.groupOwner}, {$set: {adminGroupList: newAdminGroupList}});
    //Update groupList from user collection if user were included when create group
    if (grpUsr.length != 0) {
      const queryFind = { userName: '' };
      const queryUpdate = { groupList: [] };
      const newList = [];
      grpUsr.forEach(item => {
        newList.push(item.userName);
      });
      await DBoperation.updateMany(newList, userCollection, queryFind, queryUpdate, group.groupName, 'add');
    }
    result.setResult(true, 'create new group success');
    res.send(result);
    result.resetResult();
  });
}