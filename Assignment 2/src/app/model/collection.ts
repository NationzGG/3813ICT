//User structure
export class User {
  userName: string;
  userEmail: string;
  userPassword: string;
  userAvatar: string;
  active: boolean;
  superAdmin: boolean;
  groupAdmin: boolean;
  groupList: any[];
  adminGroupList: any[];

  constructor(userName: string, userEmail: string, userPassword: string,
              userAvatar: string, active: boolean, superAdmin: boolean, groupAdmin: boolean, groupList: any[], adminGroupList: any[]) {
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

//Group structure
export class Group {
  groupName: string;
  groupChannel: any[];
  groupOwner: string;
 
  constructor(groupName: string, groupChannel: any[], groupOwner: string) {
    this.groupName = groupName;
    this.groupChannel = groupChannel;
    this.groupOwner = groupOwner;
  }
}

//Group user structure
export class GroupUser {
  groupName: string;
  userName: string;
  userAvatar: string;
  groupAssist: boolean;

  constructor(groupName: string, userName: string, userAvatar: string, groupAssist: boolean) {
    this.groupName = groupName;
    this.userName = userName;
   this.userAvatar = userAvatar;
    this.groupAssist = groupAssist;
  }
}

//Channel structure to send to server
export class Channel {
  channelName: string;
  groupBelong: string;

  constructor(channelName: string, groupBelong: string) {
    this.channelName = channelName;
    this.groupBelong = groupBelong;
  }
}

//Channel user structure to send to server
export class ChannelUser {
  groupName: string;
  channelName: string;
  userName: string;
  userAvatar: string;
  groupAssist: boolean;

  constructor(groupName: string, channelName: string, userName: string, userAvatar: string, groupAssist: boolean) {
    this.groupName = groupName;
    this.channelName = channelName;
    this.userName = userName;
   this.userAvatar = userAvatar;
    this.groupAssist = groupAssist;
  }
}

//Chat data structure
export class ChatData {
  channelName: string;
  groupBelong: string;
  userName: string;
  userAvatar: string;
  message: string;
  image: boolean;
  imagePath: string;

  constructor(
    channelName: string, groupBelong: string,
    userName: string, userAvatar: string, message: string,
    image: boolean, imagePath: string) {
    this.channelName = channelName;
    this.groupBelong = groupBelong;
    this.userName = userName;
    this.userAvatar = userAvatar;
    this.message = message;
    this.image = image;
    this.imagePath = imagePath;
  }
}
