/**
 * connect to socket and communicate with client
 *
 * @param {*} io
 * @param {*} db
 */
module.exports = (io, db) => {
    // connect to socket.io
    let channel;
    io.on('connection', (socket) => {
      console.log('connected to socket.io' + socket.id);
      // collection
      const chatCollection = db.collection('ChatHistory');
      // get channel information for database
      socket.once('channelData', (data) => {
        // get all the history from database
        chatCollection.find({$and: [{ "channelName" : data.channelName  }, { "groupBelong" : data.groupBelong }]}).toArray((err, historyData) => {
          io.emit('chatHistory', historyData);
        });
        
        io.emit('announcement', data.userName + ' has join the room');
        // listen and emit chat message
        socket.on('message', (message) => {
          // store in the database
          chatCollection.insertOne(message.msg);
          io.emit('message', message.msg);
        });
        // muannually disconnect the socket when user left room
        socket.on('manualDisconnect', () => {
          io.emit('announcement', data.userName + ' has left the room');
          socket.disconnect(true);
          console.log('disconnected');
        });
      });
      
      
    });
    
}