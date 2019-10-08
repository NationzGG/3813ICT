//Group user structure
class GroupUser {
  /**
   *Creates an instance of GroupUser.
   * @param {string} groupName
   * @param {string} userName
   * @param {string} userAvatar
   * @param {boolean} groupAssist
   * @memberof GroupUser
   */
  constructor(groupName, userName, userAvatar, groupAssist){
      this.groupName = groupName;
      this.groupUsers = userName;
      this.groupChannel = userAvatar;
      this.groupAssist = groupAssist;
    }
  }
  
  module.exports = GroupUser;
