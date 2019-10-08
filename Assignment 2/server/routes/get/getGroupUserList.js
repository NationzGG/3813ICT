/**
 * get group user list from database
 *
 * @param {Express} app
 * @param {*} db
 * @param {string} colName
 */
module.exports = (app, db) => {
  app.post('/groupUserList', async (req, res) => {
    const collection = db.collection('GroupUser');
    const count = await collection.find({groupName: req.body.groupName}).count();
    // send empty list if there is not group user
    if (count == 0){
      res.send([]);
      return;
    }
    // get group user list
    const data = await collection.find({groupName: req.body.groupName}).toArray();
    res.send(data);
  });
  
}