//Channel structure
class Channel {
  /**
   * Creates an instance of Channel.
   * @param {string} channelName
   * @param {string} groupBelong
   * @memberof Channel
   */
  constructor(channelName, groupBelong){
    this.channelName = channelName;
    this.groupBelong = groupBelong;
  }
}

module.exports = Channel;