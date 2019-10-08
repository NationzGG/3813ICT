const DBOperation = require('./model/dbOperation.js');
const Result = require('./model/result.js'); // Result class, create Result object
//Connect to database and require other routes
module.exports = (app, MongoClient, mongoUrl, dbName) => {
  const colNameUser = 'User',
        colNameGroup = 'Group',
        colNameChannel = 'Channel';
  const DBoperation = new DBOperation(),
        result = new Result(false, '');
  
  MongoClient.connect(mongoUrl, {poolSize: 10, useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
    //Print the error if connection fails
    if (err) { return console.log(err); }
    const db = client.db(dbName);
    //Login & logout
    require('./routes/login')(app, client, db, colNameUser, result);

    //Add new data
    require('./routes/add/addUser.js')(app, db, colNameUser, result);
    require('./routes/add/addGroup.js')(app, db, colNameGroup, DBoperation, result);
    require('./routes/add/addChannel.js')(app, db, colNameChannel, result);

    //Edit data
    require('./routes/edit/editGroupUser.js')(app, db, DBoperation, result);
    require('./routes/edit/editGroupUserRole.js')(app, db, DBoperation);
    require('./routes/edit/editChannelUser.js')(app, db, DBoperation);
    require('./routes/edit/edituserAvatar.js')(app, db, colNameUser);
    require('./routes/edit/editRole.js')(app, db, colNameUser, DBoperation);

    //Get data
    require('./routes/get/getChannelList.js')(app, db, colNameChannel);
    require('./routes/get/getGroupUserList.js')(app, db);
    require('./routes/get/getChannelUserList.js')(app, db);

    //Remove data
    require('./routes/remove/removeGroup.js')(app, db, colNameGroup, DBoperation);
    require('./routes/remove/removeUser.js')(app, db, colNameUser, DBoperation);
    require('./routes/remove/removeChannel.js')(app, db, colNameChannel, result);
  });
  
  //Retrieve data
  require('./routes/get/getUserDetail.js')(app, MongoClient, mongoUrl, dbName, colNameUser);
  require('./routes/get/getGroupDetail.js')(app, MongoClient, mongoUrl, dbName, colNameGroup);
  require('./routes/get/getChannelDetail')(app, MongoClient, mongoUrl, dbName, colNameChannel);
  require('./routes/get/getGroupList.js')(app, MongoClient, mongoUrl, dbName, colNameGroup);
  require('./routes/get/getUserList.js')(app, MongoClient, mongoUrl, dbName, colNameUser);
}
