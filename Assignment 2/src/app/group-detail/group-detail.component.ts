//Imports
import { Component, OnInit } from '@angular/core';
import { UserInteractionService } from '../service/user-interaction.service';
import { Router } from '@angular/router';
import { UserAuthenticationService } from '../service/user-authentication.service';
import { ErrorAlert } from '../model/common-methods';
import { GroupUser } from '../model/collection';
declare const $: any; // jquery

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css']
})
export class GroupDetailComponent implements OnInit {


  superAdmin = (localStorage.getItem('superAdmin') === 'true') ? true : false; //Bool to determine if current user is a superAdmin
  currentUser = localStorage.getItem('userName');

  groupName = '';
  channelList = []; //Groups Channel List
  userList = []; //Groups User List
  userLiNotInGp = []; //Non-Group User List
  groupAssist = []; //List of Group Assist

  alert = new ErrorAlert(); 

  editMode = false; // Bool to determine if editing
  isCollapse = false; // Bool to determine if element is open

  /*

  Permission Levels
  Level 0 - Create & Remove Group, Remove Channel, add user & remove user from group, view all users in the group
    Super Admin, Group Admin

  Level 1 - Add & Remove User from channel + Create channel + View all channels
    Super Admin, Group Admin, Group Assis

  */
  lv0Permission = false;
  lv1Permission = false;

  /// Display \\\
  constructor(private userInteractionService: UserInteractionService, private router: Router, private userAuth: UserAuthenticationService) {
    this.displayContent();
  }

  // Fetch user permission
  ngOnInit() {
    const groupAdmin = (localStorage.getItem('groupAdmin') === 'true') ? true : false;
    this.lv1Permission = (this.superAdmin || groupAdmin) ? true : false;
    this.lv0Permission = (this.superAdmin || groupAdmin) ? true : false;
  }

  // Display fetched data
  displayContent() {
    this.userInteractionService.groupDetailObserver.observer$.subscribe((data) => {
      // Re-initialise property to avoid old data
      this.groupName = data.groupName;

      this.userLiNotInGp = [];
      this.isCollapse = false;

      //Update User List
      this.userInteractionService.getGroupUser({groupName: data.groupName}).subscribe((users: any[]) => {
        this.displayUserList(users);

        //Update Channel List
        let currentAssistRole = false;
        users.forEach(item => {
          if (localStorage.getItem('userName') === item.userName) {
            currentAssistRole = item.groupAssist;
          }
        });

        this.userInteractionService.getUserDetail({userName: localStorage.getItem('userName')}).subscribe((user: any) => {

          //If current user is super Admin or group Admin or group assist, display all channels
          if (user.superAdmin || user.groupAdmin || currentAssistRole) {
            this.channelList = data.groupChannel;
            this.lv1Permission = true;
          } else {
            // If current user is a basic user, display only the channels they are in
            this.displayChannelList(data.groupName);
          }
        });
      });
    });
  }


  //Fetch User Detail 
  displayUserList(groupUserList: any[]) {
    this.userList = [];
    groupUserList.forEach(user => {

    //Initialise object
      const newUser = {
        userName: '',
        selected: false,  
        userAvatar: '',
        groupAdmin: false,
        groupAssist: false
      };

      //Fetch user data and compare user name in group list with user name in user data file
      this.userInteractionService.getUserList().subscribe((userData: any[]) => {
        userData.forEach(item => {
          if (item.userName === user.userName) {
            //Update variables
            newUser.userName = user.userName;
            newUser.groupAdmin = item.groupAdmin;
            newUser.userAvatar = user.userAvatar;
            newUser.groupAssist = user.groupAssist;
            //Update current user list
            this.userList.push(newUser);
          }
        });
      });
    });
  }

  //Fetch Channel List 
  displayChannelList(gName: string) {
    this.channelList = [];
    this.userInteractionService.getChannelList({groupName: gName}).subscribe((data: any) => {
      data.forEach(channel => {
        this.userInteractionService.getChannelUser({groupName: gName, channelName: channel.channelName}).subscribe((chUser: any[]) => {
          const i = chUser.findIndex(name => ((name.userName === localStorage.getItem('userName'))));
          if (i !== -1) {
            this.channelList.push(channel.channelName);
          }
        });
      });
    });
  }

  // Fetch non-group user list
  getUserLsNotInGp() {
    //Fetch all user list
    this.userInteractionService.getUserList().subscribe((data: any[]) => {
      const total = [];
      const newList = [];

      //Fetch list only containing usernames
      data.forEach(item => {
        total.push(item.userName);
      });

      //Remove users that already exist
      this.userList.forEach(groupUsr => {
        const i = total.findIndex(usr => ((usr === groupUsr.userName)));
        if (i >= 0) {
          total.splice(i, 1);
        }
      });

      //Update list
      this.userLiNotInGp = [];
      total.forEach(totalUserName => {
        data.forEach(user => {
          if ( totalUserName === user.userName ) {
            this.userLiNotInGp.push({ userName: totalUserName, selected: false, userAvatar: user.userAvatar});
          }
        });
      });
    });
  }


  // If the edit button is clicked, edit mode is activated
  editUserMode() {
    this.editMode = true;
  }

  //If the cancel button is clicked, reset input and alert
  cancel() {
    this.alert.closeAlert();
    this.userList.forEach(item => {
      item.selected = false;
    });
    this.userLiNotInGp.forEach(item => {
      item.selected = false;
    });
    this.editMode = false;
  }

  // If clicked, fetch non-group user list
  getUserNotInGp() {
    // this.isCollapse = true;
    this.getUserLsNotInGp();
  }

  //If the cancel button is clicked, reset input and alert
  cancelAddUser() {
    this.userLiNotInGp.forEach(item => {
      item.selected = false;
    });
    this.alert.closeAlert();
    $('#addUserModal').modal('hide');
  }

  /// Add || Remove Group User \\\
  editUser(type: string) {
    const dataSendToServer = {
      groupName: this.groupName,
      addednewUsers: [], // newly added user list
      removedUsers: [] // user list that removed from group
    };
    let userSelected = false; // check if user is selected

    //If adding user
    if (type === 'add') {
      this.userLiNotInGp.forEach(user => {
        if (user.selected) {
          userSelected = true;
          dataSendToServer.addednewUsers.push(new GroupUser(this.groupName, user.userName, user.userAvatar, false));
        }
      });
    } else {
      //If removing user
      this.userList.forEach((user, index) => {
        if (user.selected) {
          userSelected = true;
          dataSendToServer.removedUsers.push(new GroupUser(this.groupName, user.userName, user.userAvatar, user.groupAssist));
        }
      });
    }

    //If no users have been selected, then send reqst to server to update user data
    if (!userSelected) {
      this.alert.showAlert('No user select');
    } else {
      this.alert.closeAlert();
      this.userInteractionService.editGroupUser(dataSendToServer).subscribe((result: any) => {
        if (result.status !== undefined) {
          this.alert.showAlert(result.msg);
        }
        $('#addUserModal').modal('hide');
        this.editMode = false;
        this.displayUserList(result);
      });
    }
  }

  //Assign user assist role
  addAssist() {
    let newAssistRole = false;
    let newAssist = false;
    const newRole = {
      groupName: this.groupName,
      users: []
    };
    //Check if any user have been selected
    const selectedIndex = this.userList.findIndex(item => (item.selected));
    if (selectedIndex !== -1) {
      newAssistRole = true;
    }
    if (!newAssistRole) {
      this.alert.showAlert('No user selected');
    } else {
      this.userList.forEach(user => {
        // check if user is group assist, if not add to list
        if (user.selected) {
          if (user.groupAssist === false) {
            newAssist = true;
            newRole.users.push(user.userName);
          }
        }
      });
      if (!newAssist) {
        this.alert.showAlert('selcted user/s is/are already group assist');
      } else {
        this.userInteractionService.editGroupUserRole(newRole).subscribe((data: any) => {
          this.editMode = false;
          this.userList = [];
          this.alert.closeAlert();
          this.displayUserList(data);
        });
      }
    }
  }



  //Pass group data to add channel page
  addChannel() {
    this.userInteractionService.getGroupDetail({ groupName: this.groupName });
  }

  //Direct to channel page
  toChannel(name: string) {
    this.userInteractionService.getGroupDetail({ groupName: this.groupName });
    this.userInteractionService.getChannelDetail({ channelName: name, groupName: this.groupName });
    this.router.navigateByUrl('/channel');
  }

  //Remove current group
  removeGroup() {
    const data = {
      groupName: this.groupName
    };
    this.userInteractionService.removeGroup(data).subscribe(newList => {
      this.userInteractionService.groupListObservable(newList);
      this.router.navigateByUrl('/dashboard');
    });

  }

}
