/// Testing \\\

//Dependencies
const assert = require('assert'),
      url = 'http://localhost:3000',
      chai = require('chai'),
      chaiHttp = require('chai-http'),
      should = chai.should();

//Mock database
const MongoClient = require('mongodb').MongoClient,
      mongoUrl = 'mongodb://localhost:27017',
      ObjectID = require('mongodb').ObjectID
      dbName = 'chatAppTesting'; // test database for testing

//Server connection
const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      http = require('http').Server(app); // listen to the server

//Model used in routes
const User = require('../model/user.js'),
      Group = require('../model/group.js'),
      Channel = require('../model/channel.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

chai.use(chaiHttp);

/// Start Testing \\\
describe('Server test', () => {
  before((done) => { 
    console.log('Before test - initialise test database');
    //Empty test database
    require('./resetTestDB.js')(MongoClient, mongoUrl, dbName, (result) => {
      console.log(result.msg);
      //All the routes files
      require('../dbRoutes.js')(app, MongoClient, mongoUrl, dbName);
      done();
    });
  });
  after((done) => { 
    console.log('After test'); 
    done();
  });

  /// Initialise Database \\\
    
  //Test initialise Admin data
  describe('Test initialise Admin user', () => {
    // test case 1
    it('Case 1: create Admin user when Admin not exist - result => true', (done) => {
      require('../initialData/adminUser.js')(MongoClient, mongoUrl, dbName, (result) => {
        // result should exist
        should.exist(result);
        // should have correct ok val and message
        should.equal(result.status, true);
        should.equal(result.msg, 'create success');
        done();
      
      });
      
    });

    //Testcase 1
    it('Case 2: create amdmin user when Admin exist already - result => false', (done) => {
      require('../initialData/adminUser.js')(MongoClient, mongoUrl, dbName, (result) => {
        //Result should exist
        should.exist(result);
        //Should have correct ok val and message
        should.equal(result.status, false);
        should.equal(result.msg, 'Admin user already exists'); 
        done();
      });
      
    });
  });

 ///Back-end sever connection
  //Test for connect to server localhost:3000
  describe('Test server connection', () => {
    it('status val should be true with success message', (done) => {
      require('../routes/listen.js')(http, (result) => {
        // result should exist
        should.exist(result);
        // should have correct ok val and message
        should.equal(result.status, true);
        should.equal(result.msg, 'connected to server on port 3000');
        done();
      });
    });
  });

 //Login && logout
  //Test login routes
  describe('Test login route', () => {
    let user = {'userName': '', 'password':''}; // initialise dummy user input
    
    //Testcase 1
    it('Case 1: login with correct username and password - result => object, should have userName property with correct value', (done) => {
      //Change the username and password to Admin
      user.userName = 'Admin';
      user.password = 'Admin';
      chai.request(url).post('/login').type('form').send(user)
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            res.body.should.have.property('userName'); 
            should.equal(res.body.userName, 'Admin');
            done();
          });
     
    });
    //Testcase 2
    it('Case 2: login with wrong username - result => false', (done) => {
      //Change the username and password to something not exist on database
      user.userName = 'somethingNotExists';
      user.password = '123';
      chai.request(url).post('/login').type('form').send(user)
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            // should have correct valid val and message
            should.equal(res.body.status, false);
            should.equal(res.body.msg, 'Username does not exist');
            done();
          });

    });
    //Testcase 3
    it('Case 3: login with wrong password - result => false', (done) => {
      //Change the username to Admin and password to 123 <- not right password
      user.userName = 'Admin';
      user.password = '123';
      chai.request(url).post('/login').type('form').send(user)
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            // should have correct valid val and message
            should.equal(res.body.status, false);
            should.equal(res.body.msg, 'Wrong password');
            done();
          });      
    });
  });
  
   ///Test Data
  //Test addUser route
  describe('Test addUser route', () => {
    // mock user data
    const user = new User('kate', 'kate@kate.com', '123@321', '', false, false, true, [], []);

    //Testcase 1
    it('Case 1: input with new username, result status => true', (done) => {
      chai.request(url).post('/addUser').type('form').send(user)
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            // should have correct status val and message
            should.equal(res.body.status, true);
            should.equal(res.body.msg, 'create new user success');
            done();
          });
    });
    //Testcase 2
    it('Case 2: input with existing username, result status => false', (done) => {
      chai.request(url).post('/addUser').type('form').send(user)
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            // should have correct status val and message
            should.equal(res.body.status, false);
            should.equal(res.body.msg, 'user already exist');
            done();
          });
    });
  });

  //Test addGroup route
  describe('Test addGroup route', () => {
    //Mock group data
    const group = new Group('group1', [], 'Admin');
    //Testcase 1
    it('Case 1: input with new group name, result status => true', (done) => {
      chai.request(url).post('/addGroup').type('form').send([group, []])
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            // should have correct status val and message
            should.equal(res.body.status, true);
            should.equal(res.body.msg, 'create new group success');
            done();
          });
    });
    //Testcase 2
    it('Case 2: input with existing group name, result status => false', (done) => {
      chai.request(url).post('/addGroup').type('form').send([group, []])
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            // should have correct status val and message
            should.equal(res.body.status, false);
            should.equal(res.body.msg, 'group already exist');
            done();
          });
    });
    //Testcase 3
    it('Case 3: input new group name, updated User collection - adminGroupList should have correct groups', (done) => {
      chai.request(url).post('/userDetail').type('form').send({'userName': 'Admin'})
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            should.equal(res.body.adminGroupList[0], 'group1');
            done();
          });
    });
    //Testcase 4
    it('Case 4: input new group name with user, result status => true', (done) => {
      const newGroup = new Group('group with user', [], 'Admin');
      chai.request(url).post('/addGroup').type('form').send([newGroup, [{'groupName': 'group with user','userName': 'kate','userAvatar': '', 'groupAssist': false}]])
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            // should have correct status val and message
            should.equal(res.body.status, true);
            should.equal(res.body.msg, 'create new group success');
            done();
          });
    });
    //Testcase 5
    it('Case 5: input new group name with user, updated User collection - groupList should contain new group', (done) => {
      chai.request(url).post('/userDetail').type('form').send({'userName': 'kate'})
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            res.body.groupList.should.include('group with user');
            done();
          });
    });
  });  

  //Test addChannel route \\\
  describe('Test addChannel route', () => {
    //Mock channel data
    const channel = new Channel('channelA', 'group1');
    //Testcase 1
    it('Case 1: input with new channel name, result status => true', (done) => {
      chai.request(url).post('/addChannel').type('form').send([channel, ['channelA']])
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            // should have correct status val and message
            should.equal(res.body.status, true);
            should.equal(res.body.msg, 'create new channel success');
            done();
          });
    });
    //Testcase 2
    it('Case 2: input with existing channel name, result status => false', (done) => {
      chai.request(url).post('/addChannel').type('form').send([channel, ['channelA']])
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            // should have correct status val and message
            should.equal(res.body.status, false);
            should.equal(res.body.msg, 'channel already exist');
            done();
          });
    });
    //Testcase 3
    it('Case 3: add second new channel, result status => true', (done) => {
      const channel2 = new Channel('channelB', 'group1');
      chai.request(url).post('/addChannel').type('form').send([channel2, ['channelA', 'channelB']]).end((err, res) => {
        res.should.have.status(200); // respons exist
        // should have correct status val and message
        should.equal(res.body.status, true);
        should.equal(res.body.msg, 'create new channel success');
        done();
      });
          
    });
    //Testcase 4
    it('Case 4: after add channel from case3, updated Group collection - groupChannel length should be 2', (done) => {
      chai.request(url).post('/groupDetail').type('form').send({'groupName': 'group1'})
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            res.body.groupChannel.should.have.lengthOf(2);
            done();
          });
    });
  });    


  /// Test Retrieve data \\\
  // Test get group list route
  describe('Test getGroupList route', () => {
    it('No input, should get an array as result from database', (done) => {
      chai.request(url).get('/groupList')
          .end((err, res) => {
            res.should.have.status(200);  // respons exist
            res.body.should.be.a('array'); 
            done();
          });
    });
  });
  //Test get group user list route
  describe('Test getUserDetail route',() => {
    //Testcase 1
    it('input with group1 - should have array length of 0', (done) => {
      chai.request(url).post('/groupUserList').type('form').send({'groupName': 'group1'})
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            res.body.should.have.lengthOf(0);
            done();
          });
    });
    //Testcase 1
    it('input with group with user - should have array length of 1', (done) => {
      chai.request(url).post('/groupUserList').type('form').send({'groupName': 'group with user'})
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            res.body.should.have.lengthOf(1);
            done();
          });
    });
  });

  //Test get user list route
  describe('Test getUserList route', () => {
    //Testcase 1
    it('Case 1: No input, should get an array as result from database', (done) => {
      chai.request(url).get('/users')
          .end((err, res) => {
            res.should.have.status(200);  // respons exist
            res.body.should.be.a('array'); 
            done();
          });
    });
    //Testcase 2
    it('Case 2: No input, should get have Admin data', (done) => {
      chai.request(url).get('/users')
          .end((err, res) => {
            res.should.have.status(200);  // respons exist
            should.equal(res.body[0].userName, 'Admin'); // should contain Admin (default)
            done();
          });
    });
  });

  //Test get user detail route
  describe('Test getUserDetail route',() => {
    it('input with username - should retrieve correct user detail', (done) => {
      chai.request(url).post('/userDetail').type('form').send({'userName': 'Admin'})
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            should.equal(res.body.userName, 'Admin');
            done();
          });
    });
  });

  //Test get group detail route
  describe('Test getGroupDetail route',() => {
    it('input with group name - should retrieve correct group detail', (done) => {
      chai.request(url).post('/groupDetail').type('form').send({'groupName': 'group1'})
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            should.equal(res.body.groupName, 'group1');
            done();
          });
    });
  });

  //Test get channel detail route
  describe('Test getChannelDetail route',() => {
    const dataToSend = {'channelName':'channelA', 'groupName': 'group1'};
    //Testcase 1
    it('Case 1: input with channel & group name - res.body should be an array', (done) => {
      chai.request(url).post('/channelDetail').type('form').send(dataToSend)
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            done();
          });
    });
    //Testcase 2
    it('Case 2: input with channel & group name - should retrieve correct channel detail', (done) => {
      chai.request(url).post('/channelDetail').type('form').send(dataToSend)
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            should.equal(res.body.channelName, 'channelA');
            done();
          });
    });
  });

  //Test get channel detail route
  describe('Test getChannelList route',() => {
    //Testcase 1
    it('Case 1: group1 have two channel - res.body should be an array and length should be 2', (done) => {
      chai.request(url).post('/channelList').type('form').send({'groupName': 'group1'})
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            res.body.should.have.lengthOf(2);
            done();
          });
    });
    //Testcase 2
    it('Case 2: group does not have channels - should be an array and have length of 0', (done) => {
      chai.request(url).post('/channelList').type('form').send({'groupName': 'group with user'})
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            res.body.should.have.lengthOf(0);
            done();
          });
    });
  });

  //Test get channel detail route
  describe('Test getChannelUserList route',() => {
    it('input with group name and channel name, and result array length should be 0', (done) => {
      chai.request(url).post('/channelUserList').type('form').send({'groupName': 'group1', 'channelName': 'channelB'})
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            res.body.should.have.lengthOf(0);
            done();
          });
    });
  });


 /// Test update data \\\
  // Test editGroupUser route
  describe('Test editGroupUser route',() => {
    const dataToSendA = {'groupName':'group1', 'addednewUsers': [{'groupName':'group1', 'userName':'kate', 'userAvatar': '', 'groupAssit': false}], 'removedUsers': []};
    //Testcase 1
    it('Case 1: add new user to group - group user list length should be 1', (done) => {
      chai.request(url).post('/editGroupUser').type('form').send(dataToSendA)
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            res.body.should.have.lengthOf(1);
            done();
          });
    });

    //Testcase 2
    it('Case 2: updated User collection - groupList should contain new group', (done) => {
      chai.request(url).post('/userDetail').type('form').send({'userName': 'kate'})
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            res.body.groupList.should.include('group1');
            done();
          });
    });

    //Testcase 3
    const dataToSendB = {'groupName':'group1', 'addednewUsers': [], 'removedUsers': [{'groupName':'group1', 'userName':'kate', 'userAvatar': '', 'groupAssit': false}]};
    it('Case 3: remove user from group - group user list length should be 0', (done) => {
      chai.request(url).post('/editGroupUser').type('form').send(dataToSendB)
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            // should have correct status val and message
            res.body.should.have.lengthOf(0);
            done();
          });
    });

    //Testcase 4
    it('Case 4: updated User collection - groupList should not contain the group', (done) => {
      chai.request(url).post('/userDetail').type('form').send({'userName': 'kate'})
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            res.body.groupList.should.not.include('group1');
            done();
          });
    });

  });

  //Test editGroupUserRole route
  describe('Test editGroupUserRole route', () => {
    it('assign user group assit - assit should be true', (done) => {
      chai.request(url).post('/editGroupUserRole').type('form').send({'groupName': 'group with user', 'users': ['kate']})
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            should.equal(res.body[0].groupAssist, true);
            done();
          });
    });
  });

  //Test editChannelUser route
  describe('Test editChannelUser route',() => {
    const channelUserData = {'channelName' : 'channelA', 'groupName' : 'group1', 'userName': 'kate', 'userAvatar': '', 'groupAssist': false};
    const dataToSend = {'channelName' : 'channelA', 'groupName' : 'group1', 'addednewUsers' : [channelUserData], 'removedUsers': []};
    const dataToSendB = {'channelName' : 'channelA', 'groupName' : 'group1', 'addednewUsers' : [], 'removedUsers': [channelUserData]};
    //Testcase 1
    it('Case 1: add new user to channel - channelUser length should be 1', (done) => {
      chai.request(url).post('/editChannelUser').type('form').send(dataToSend)
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            // should have correct status val and message
            res.body.should.have.lengthOf(1);
            done();
          });
    });

    //Testcase 2
    it('Case 2: remove user from channel - channelUser length should be 0', (done) => {
      chai.request(url).post('/editChannelUser').type('form').send(dataToSendB)
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            // should have correct status val and message
            res.body.should.have.lengthOf(0);
            done();
          });
    });
  });

  //Test edituserAvatar route
  describe('Test edituserAvatar route',() => {
    it('update with new file name, res value should have new file name', (done) => {
      chai.request(url).post('/edituserAvatar').type('form').send({'userName': 'kate', 'userAvatar': '156224823.jpg'})
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            // should have correct name
            should.equal(res.body.userAvatar, '156224823.jpg');
            done();
          });
    });
  });

  //Test edit user role routes
  describe('Test editRole route',() => {
    //Testcase 1
    it('give user groupAdmin role, should user groupAdmin should be true', (done) => {
      chai.request(url).post('/editRole').type('form').send({'users': ['kate'], 'newRole': 'groupAdmin'})
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            should.equal(res.body[1].groupAdmin, true);
            done();
          });
    });
    //Testcase 2
    it('give user superAdmin role, should user superAdmin should be true', (done) => {
      chai.request(url).post('/editRole').type('form').send({'users': ['kate'], 'newRole': 'superAdmin'})
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            should.equal(res.body[1].superAdmin, true);
            done();
          });
    });
  });


  /// Test delete data \\\
  //Test removeGroup routes
  describe('Test removeGroup route',() => {
    //Testcase 1
    it('remove given group, group list length should be 1', (done) => {
      chai.request(url).post('/removeGroup').type('form').send({'groupName': 'group with user'})
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            res.body.should.have.lengthOf(1);
            done();
          });
    });
    //Testcase 2
    it('extend from privious case, groupList of user should have lenth of 0 ', (done) => {
      chai.request(url).post('/userDetail').type('form').send({'userName': 'kate'})
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            res.body.groupList.should.have.lengthOf(0);
            done();
          });
    });
  });
  //Test removeChannel route
  describe('Test removeChannel route', () => {
    //Testcase 1
    it('remove given channel, res status should be true', (done) => {
      chai.request(url).post('/removeChannel').type('form').send({"channelName" : "channelB", "groupName" : "group1"})
          .end((err, res) => {
            res.should.have.status(200);
            should.equal(res.body.status, true);
            done();
          });
    });
    //Testcase 2
    it('after remove channel, channel list length should be 1', (done) => {
      chai.request(url).post('/channelList').type('form').send({"groupName" : "group1"})
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.lengthOf(1);
            done();
          });
    });
  }),
  //Test removeUser routes
  describe('Test removeUser route',() => {
    it('remove given user, user list length should be 1', (done) => {
      chai.request(url).post('/removeUser').type('form').send({'userName': 'kate'})
          .end((err, res) => {
            res.should.have.status(200); // respons exist
            res.body.should.have.lengthOf(1);
            done();
          });
    });
  });
});
