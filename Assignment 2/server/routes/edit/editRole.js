/**
 * Assign user super Admin or group Admin role
 *
 * @param {Express} app
 * @param {*} db
 * @param {string} colName
 * @param {DBoperation} DBoperation
 */
module.exports = (app, db, colName, DBoperation)=>{
  app.post('/editRole', async (req, res)=>{
    // initialise varibles
    const userCollection = db.collection(colName);
    const users = req.body.users;
    const newRole = req.body.newRole;

    // ass user new role
    await DBoperation.forEachData(users, async (name) => {
      if (newRole == 'superAdmin'){
        await userCollection.updateOne({userName: name}, {$set: {superAdmin: true}});
      } else if (newRole == 'groupAdmin'){
        await userCollection.updateOne({userName: name}, {$set: {groupAdmin: true}});
      }
    });
    // get new user list
    const userList = await userCollection.find({}).toArray();
    res.send(userList);
  });
  
}
