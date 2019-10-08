//Model
const Result = require('./model/result.js'); // Result class, create Result object

//Socket && Database && Formidable Routes

module.exports = (app, MongoClient, mongoUrl, dbName, io, formidable, filePath) => {
  const result = new Result(false, '');
  MongoClient.connect(mongoUrl, {poolSize: 10, useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
    //Print the error if connection fail
    if (err) { return console.log(err); }
    const db = client.db(dbName);
    //Socket
    require('./routes/chat.js')(io, db);
    
  });
  //File upload
  require('./routes/upload/userAvatar.js')(app, formidable, filePath, result);
  require('./routes/upload/chatImage.js')(app, formidable, filePath, result);
  
  
}
