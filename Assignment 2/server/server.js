//Back-end Server
const express = require('express'), 
      app = express(), //Express
      http = require('http').Server(app), //Listen
      cors = require('cors'), //localhost:4200 request localhost:3000
      bodyParser = require('body-parser');

//Database
const MongoClient = require('mongodb').MongoClient,
      mongoUrl = 'mongodb://localhost:27017',
      ObjectID = require('mongodb').ObjectID,
      dbName = 'chat';
      console.log('Successfully connected to database');

//Socket IO
const io = require('socket.io')(http);
console.log('Successfully connected to socket');

//File upload
const filePath = require('path'),
      formidable = require('formidable');
      console.log('Image File uploaded');

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../dist/chatApplication3813ictAssessment'));

//Display user avatar image
app.use(express.static(__dirname + '/image/avatar/'));
app.get('/userAvatar', (req, res) => {
  let imagePath = __dirname + '/image/avatar/' + req.query.fileName;
  res.sendFile(imagePath);
  console.log('User avatar image displayed');
});

//Display chat images
app.use(express.static(__dirname + '/image/message/'));
app.get('/chat/message', (req, res) => {
  let imagePath = __dirname + '/image/message/' + req.query.fileName;
  res.sendFile(imagePath);
  console.log('Chat image displayed');
});

//Initialise Admin user into database when new database is used
require('./initialData/adminUser.js')(MongoClient, mongoUrl, dbName, (result) => {
  if(result.status){
    console.log('Admin profile initialised');
    console.log(result.msg);
  }
});

//Start server
require('./routes/listen.js')(http, (result) => {
  console.log(result.msg);
});

//Routes
require('./dbRoutes.js')(app, MongoClient, mongoUrl, dbName);
require('./otherRoutes.js')(app, MongoClient, mongoUrl, dbName, io, formidable, filePath);

