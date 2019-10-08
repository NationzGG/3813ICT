/**
 * Compare username and password from database
 *    send result with message if name/password not correct
 *    send user data if name & password are all correct
 *
 * @param {Express} app
 * @param {*} client
 * @param {string} db
 * @param {string} colName
 * @param {Result} result
 */

module.exports = (app, client, db, colName, result)=>{
  app.post('/login', async (req, res)=>{
    var usernameInput = req.body.userName;
    var userPasswordInput = req.body.password;

    const collection = db.collection(colName);
    // check if username exist
    const count = await collection.find({userName: usernameInput}).count();
    if (count < 1) {
      result.msg = 'Username does not exist';
      res.send(result);
      client.close();
      return result;
    }

    // user exists, check if password match
    const userArray = await collection.find({userName: usernameInput}).toArray();
    const user = userArray[0];

    // if password does not match
    if (user.userPassword != userPasswordInput) {
      result.msg = 'Wrong password';
      res.send(result);
      client.close();
      return result;
    }

    // update user login status valid->true
    user.active = true; // update the array data send back to front-end
    await collection.updateOne({userName: usernameInput}, {$set: {active: true}});
    result.resetResult()
    res.send(user);
    client.close();
  });
}