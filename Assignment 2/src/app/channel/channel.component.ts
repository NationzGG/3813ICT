//Imports
import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { UserInteractionService } from '../service/user-interaction.service';
import { SocketService } from '../service/socket.service';
import { FileUploadService } from '../service/file-upload.service';
import { ChatData, ChannelUser } from '../model/collection';
import { ErrorAlert } from '../model/common-methods';
import { Message } from '../model/common-methods';
import { Router } from '@angular/router';

declare const $: any;

const avatarPath = 'http://localhost:3000/userAvatar?fileName='; // avatar path to display user avatar
const chatImagePath = 'http://localhost:3000/chat/message?fileName='; // image path to display chat image

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit, OnDestroy {

  userList = []; // list of current channel users
  userListNIC = []; // list of current group users that are not in the channel

 //Group && Channel Data
  groupName = '';
  channelName = '';
  groupUsers = [];

  //Live Chat 
  chatInput = ''; //Message input field data
  messages = []; //List of messages for display
  image = false; //Determine if user upload image
  imageFile = null; //Image file send to server
  imagePreview = ''; //Image preview path
  hasHistory = false; //If the chat has history
  historyMessages = []; //List of history messages
  selfMessage = false; //If the message is send by self

  
  editMode = false; //Bool value for activating edit mode

  //Alerts
  alert = new ErrorAlert();
  chatAlert = new ErrorAlert();

  
 
  // Level 0 - Remove Channel, add user & remove user from channel
  //   Super Admin, Group Admin
  lv1Permission = false;

  //Level 1 - Add & Remove User from channel
  //  Super Admin, Group Admin, Group Assis
  lv0Permission = false;


/// Display \\\
  constructor(
    private userInteractionService: UserInteractionService,
    private router: Router, private socketService: SocketService,
    private fileUploadService: FileUploadService) {
  }

  //User Join Channel
  ngOnInit() {
    console.log('ngOnInit');

    //Fetch current user permission level
    const superAdmin = (localStorage.getItem('superAdmin') === 'true') ? true : false;
    const groupAdmin = (localStorage.getItem('groupAdmin') === 'true') ? true : false;
    this.lv0Permission = (superAdmin || groupAdmin) ? true : false;
    this.lv1Permission = (superAdmin || groupAdmin) ? true : false;
    //Connect to socket
    this.socketService.socketInit();

    //Display channel detail
    this.displayChannelDetail();

    //Fetch message history
    this.socketService.historyObserver().subscribe((histories) => {
      this.historyMessages = [];
      if (histories !== null) {
        this.hasHistory = true;
        histories.forEach(history => {
          this.historyMessages.unshift(this.setMessage(history));
        });
      } else {
        this.hasHistory = false;
        this.historyMessages = [];
      }
      console.log(this.historyMessages);
    });

    //Observe messages and announcements
    this.socketService.messageObserver().subscribe((data) => {
      this.messages.unshift(this.setMessage(data));
    });

    //Fetch announcement: user enter room, left room
    this.socketService.announcementObserver().subscribe((message) => {
      const newMessage = new Message(true, '', '', message, false, '', false);
      this.messages.unshift(newMessage);
    });
  }

  //User left the channel, disconnect the socket
  ngOnDestroy(): void {
    this.socketService.closeSocket();
  }

  //Display message
  setMessage(data: any): Message {
    let avatar = data.userAvatar ;
    let chatImage = data.imagePath;
    if (avatar === '' ) {
      avatar = 'assets/defaultAvatar.png';
    } else {
      avatar = avatarPath + avatar;
    }
    if (data.image) {
      chatImage = chatImagePath + chatImage;
    }
    if (data.userName === localStorage.getItem('userName')) {
      this.selfMessage = true;
    } else {
      this.selfMessage = false;
    }
    const newMessage = new Message(
      false, data.userName, avatar, data.message,
      data.image, chatImage, this.selfMessage);
    return newMessage;
  }

  //Display channel detail
  displayChannelDetail() {
    //Fetch user list that are in the channel
    this.userInteractionService.channelDetailObserver.observer$.subscribe((data) => {
      this.channelName = data.channelName;
      this.groupName = data.groupBelong;
      this.userInteractionService
          .getChannelUser({groupName: data.groupBelong, channelName: data.channelName})
          .subscribe((channelUser: any[]) => {
        this.generateUserList(channelUser);
      });
      this.userInteractionService.getGroupUser({groupName: data.groupBelong}).subscribe((groupUserData: any) => {
        //groupUsers for compare with channel users and get list of users that are not in channel
        this.groupUsers = groupUserData;
        //Check if current user is group assist and update permission
        if (groupUserData.length !== 0) {
          groupUserData.forEach(item => {
            if (localStorage.getItem('userName') === item.userName) {
              if (item.groupAssist) {
                this.lv1Permission = true;
              }
            }
          });
        }
      });
      //Pass current channel information to socket, for store chat history in database
      this.socketService.sendChannelDetail({
        channelName: data.channelName,
        groupBelong: data.groupBelong,
        userName: localStorage.getItem('userName')
      });
    });
  }

  //Restructure for display
  generateUserList(userArray: any[]) {
    this.userList = [];
    userArray.forEach(user => {
      let path = 'assets/defaultAvatar.png';
      if (user.userAvatar !== '') {
        path = avatarPath + user.userAvatar;
      }
      this.userList.push({
        userName: user.userName, selected: false, userAvatar: user.userAvatar,
        fullAvatarPath: path, groupAssist: user.groupAssist});
    });
  }

  //Fetch list of user who are not in this channel
  getUserLsNotInCh() {
    //Compare channel users with group users, remove user that already in the channel
    this.userList.forEach(user => {
      const i = this.groupUsers.findIndex(groupUser => ((groupUser.userName === user.userName)));
      if (i > -1) {
        this.groupUsers.splice(i, 1);
      }
    });
    //Update the userListNIC
    this.userListNIC = [];
    this.groupUsers.forEach(user => {
      this.userListNIC.push({ userName: user.userName, selected: false,  userAvatar: user.userAvatar, groupAssist: user.groupAssist});
    });
  }

  
  /// Actions \\\

  //Enable Edit Mode
  editUser() {
    this.editMode = true;
  }

  //Reset user inputs and alerts
  cancel() {
    this.userListNIC.forEach(item => {
      item.selected = false;
    });
    this.editMode = false;
    this.alert.closeAlert();
  }

  //Reset user inputs and close modal for add user
  close() {
    this.userListNIC.forEach(item => {
      item.selected = false;
    });
    $('#addUserChModal').modal('hide');
    this.alert.closeAlert();
  }

  //Redirect to grouppage
  backToGroup() {
    //Call group observer to display group page
    this.userInteractionService.getGroupDetail({ groupName: this.groupName });
    this.router.navigateByUrl('/group');
  }

  /// Database \\\

  //Remove current channel
  removeChannel() {
    const data = {
      groupName: this.groupName,
      channelName: this.channelName
    };
    this.userInteractionService.removeChannel(data).subscribe(result => {
      this.userInteractionService.getGroupDetail({ groupName: this.groupName });
      this.router.navigateByUrl('/group');
    });
  }

  //Remove user from channel
  addOrRemoveUser(type: string) {
    const channelUserData = {
      channelName: this.channelName,
      groupName: this.groupName,
      addednewUsers: [],
      removedUsers: []
    };
    let editUser = false;

    if (type === 'add') {

      //Add new users
      this.userListNIC.forEach(user => {
        if (user.selected) {
          editUser = true;
          const newUser = new ChannelUser(this.groupName, this.channelName, user.userName, user.userAvatar, user.groupAssist);
          channelUserData.addednewUsers.push(newUser);
        }
      });
    } else {
      // Add removed users
      this.userList.forEach(user => {
        if (user.selected) {
          editUser = true;
          const newUser = new ChannelUser(this.groupName, this.channelName, user.userName, user.userAvatar, user.groupAssist);
          channelUserData.removedUsers.push(newUser);
        }
      });
    }
    //If user has been selected, send data to server
    if (editUser) {
      this.alert.closeAlert();
      this.userInteractionService.editChannelUser(channelUserData).subscribe((data: any) => {
        editUser = false;
        this.editMode = false;
        this.generateUserList(data);
        $('#addUserChModal').modal('hide');
      });
    } else {
      this.alert.showAlert('Please select at least one user to perform action');
    }
  }

  /// Image \\\

  //Fetch Image File
  imageSelected(files: any) {
    this.image = true;
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.imagePreview = event.target.result;
    };
    reader.readAsDataURL(files[0]);
    this.imageFile = files[0];
  }

  //Reset properties when user cancelS upload image
  cancelImageUpload() {
    this.image = false;
    this.imageFile = null;
  }

  /// Socket \\\

  // Send meesage to socket
  sendMsg() {
    const finishUpload = false;
    //If is image
    if (this.image) {
      this.chatAlert.closeAlert();
      const form = new FormData();
      form.append('file', this.imageFile, this.imageFile.name);
      //Upload file
      this.fileUploadService.uploadChatImage(form).subscribe((data: any) => {
        if (data.status) {
          this.sendToSocket('imageMessage', data.msg);
        }
      });
    } else if (this.chatInput) {
      this.chatAlert.closeAlert();
      this.sendToSocket('normalMessage', '');
    } else {
      this.chatAlert.showAlert('Atempt to send empty message, please enter message');
    }

  }

  //Send Message to Socket
  sendToSocket(type: string, imageFilePath: string) {
    this.userInteractionService.getUserDetail({userName: localStorage.getItem('userName')}).subscribe((data: any) => {
      const chatData = new ChatData(this.channelName, this.groupName, data.userName, data.userAvatar, '', false, '');
      if (type === 'normalMessage') {
        chatData.message = this.chatInput;
      } else {
        chatData.image = true;
        chatData.imagePath = imageFilePath;
      }
      this.socketService.emitMsg({msg: chatData});
      this.chatInput = '';
      this.image = false;
      this.imageFile = null;
    });
  }

}
