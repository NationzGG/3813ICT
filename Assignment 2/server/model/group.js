// group structure
class Group {
/**
 *Creates an instance of Group.
 * @param {string} groupName
 * @param {any[]} groupChannel
 * @param {string} groupOwner
 * @memberof Group
 */
constructor(groupName, groupChannel, groupOwner){
    this.groupName = groupName;
    this.groupChannel = groupChannel;
    this.groupOwner = groupOwner;
  }
}

module.exports = Group;