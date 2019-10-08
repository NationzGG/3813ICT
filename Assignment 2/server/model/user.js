// User class structure
class User {
  /**
   * Creates an instance of User.
   * @param {string} userName
   * @param {string} userEmail
   * @param {string} userPassword
   * @param {string} userAvatar
   * @param {boolean} active
   * @param {boolean} superAdmin
   * @param {boolean} groupAdmin
   * @param {any[]} groupList
   * @param {any[]} adminGroupList
   * @memberof User
   */
  constructor(userName, userEmail, userPassword, userAvatar, active, superAdmin, groupAdmin, groupList, adminGroupList){
        this.userName = userName;
        this.userEmail = userEmail;
        this.userPassword = userPassword;
        this.userAvatar = userAvatar;
        this.active = active;
        this.superAdmin = superAdmin;
        this.groupAdmin = groupAdmin;
        this.groupList = groupList;
        this.adminGroupList = adminGroupList;

    }
}

module.exports = User;
