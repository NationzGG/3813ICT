//Model
const User = require('../../model/user.js'); // User class, create User object

//Add new user
module.exports = (app, db, colName, result) =>{
  app.post('/addUser', async (req, res)=>{
    //Initilaise varibles
    let user = new User(req.body.userName, req.body.userEmail, req.body.userPassword,req.body.userAvatar, req.body.active, req.body.superAdmin, req.body.groupAdmin, [], []);
    const collection = db.collection(colName);

    //Check if userName already exists
    const count = await collection.find({userName: user.userName}).count();
    if (count > 0) {
      result.setResult(false, 'user already exist');
      res.send(result);
      return result;
    }

    //Add user
    await collection.insertOne(user);
    result.setResult(true, 'create new user success');
    res.send(result);
    result.resetResult();
  });
  
}
