// Chat message structure 
class ChatData {
  /**
  *Creates an instance of ChatHistory.
  * @param {string} channelName
  * @param {string} groupBelong
  * @param {string} userName
  * @param {string} message
  * @param {boolean} image
  * @param {string} imagePath
  * @memberof ChatHistory
  */
  constructor(channelName, groupBelong, userName, message, image, imagePath){
    this.channelName = channelName;
    this.groupBelong = groupBelong;
    this.userName = userName;
    this.message = message;
    this.image = image;
    this.imagePath = imagePath;
  }
}

module.exports = ChatData;