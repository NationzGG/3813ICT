//Imports
import { Component, OnInit } from '@angular/core';
import { UserInteractionService } from '../service/user-interaction.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAuthenticationService } from '../service/user-authentication.service';
declare const $: any; 

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  
  //Current user data
  currentUser = localStorage.getItem('userName');
  superAdmin = (localStorage.getItem('superAdmin') === 'true') ? true : false;
  groupAdmin = (localStorage.getItem('groupAdmin') === 'true') ? true : false;
  specialUser = (this.superAdmin || this.groupAdmin) ? true : false;

  //Display the group and users
  groupList = []; // list of group
  userList = []; // list of users

  //Display alert 
  alert = false;
  alertMsg = '';

  //Add channel
  groupName = '';
  editMode = false;

  /// Display \\\

  //Observe changes and update properties for display
  constructor(private userInteractionService: UserInteractionService, private router: Router, private userAuth: UserAuthenticationService) {
    this.userInteractionService.actionObserver.observer$.subscribe(data => {
      if (data === 'cancel' || data === 'backToDashboard') {
        this.userList = [];
        if (this.superAdmin) {
          this.userInteractionService.getUserList().subscribe((array: any[]) => {
            this.getUserList(array);
          });
        }
      }
    });

    //Observe when things change
    this.userInteractionService.groupListObserver.observer$.subscribe(data => {
      this.groupList = data;
    });
    this.userInteractionService.userListObserver.observer$.subscribe(data => {
      this.getUserList(data);
    });
  }

  //Fetch data from the server and assign to properties to the display
  ngOnInit() {
    //If user is a super Admin, display all the users in the database
    if (this.superAdmin) {
      this.userInteractionService.getUserList().subscribe((data: any[]) => {
        this.getUserList(data);
      });
    }
    //Read from localdata when first launch
    this.userInteractionService.getUserDetail({ userName: localStorage.getItem('userName') }).subscribe((data: any) => {
      //If the user is either super Admin or group Admin, fetch full user list
      if (this.specialUser) {
        this.userInteractionService.getGroupList().subscribe((groupData: any) => {
          if (groupData.length !== 0) {
            const newList = [];
            groupData.forEach(group => {
              newList.push({ groupName: group.groupName});
            });
            this.groupList = newList;
          }
        });
      } else {
        //If user is a normal user, fetch the current grouplist of the user
        if (data.groupList.length !== 0) {
          const newList = [];
          data.groupList.forEach(name => {
            newList.push({ groupName: name});
          });
          this.groupList = newList;
        }
      }
    });
  }

  //Fetch group detail and redirect
  displayGroupDetail(name: string) {
    this.userInteractionService.getGroupDetail({ groupName: name.split('-').join(' ') });
    this.router.navigateByUrl('/group');
  }

  //Fetch user list and transform
  getUserList(userArray: any[]) {
    const newList = [];
    userArray.forEach(item => {
      if (item.userName !== localStorage.getItem('userName')) {
        const user = {
          userName: item.userName,
          selected: false,
          role0: item.superAdmin ? 'SA' : '',
          role1: item.groupAdmin ? 'GA' : ''
        };
        newList.push(user);
      }
    });
    this.userList = newList;
  }

  /// Action \\\

  //Enable edit mode
  editUser() {
    this.editMode = true;
  }

  //Rest input and alert
  cancel() {
    this.userList.forEach(item => {
      item.selected = false;
    });
    this.alert = false;
    this.editMode = false;
    $('#editUserModal').modal('hide');
  }

  /// Database \\\

  //Assign user role
  assignNewRole(type: string) {
    let editRole = false;
    const userRole = {
      users: [],
      newRole: ''
    };

    //Determine if user is selected
    const selectedIndex = this.userList.findIndex(item => (item.selected));
    if (selectedIndex !== -1) {
      editRole = true;
    }
    //Send data to server
    if (editRole) {
      //Update varible
      this.userList.forEach(user => {
        if (user.selected) {
          if (type === 'super' && user.role0 === '') {
            userRole.users.push(user.userName);
            userRole.newRole = 'superAdmin';
          } else if (type === 'group' && user.role1 === '') {
            userRole.users.push(user.userName);
            userRole.newRole = 'groupAdmin';
          }
        }
      });
      //Check if the user already has the role
      if (userRole.newRole === '') {
        this.alert = true;
        this.alertMsg = 'currently all selected users already have' + type + 'Admin.';
      } else {
        //Send to server
        this.userInteractionService.editRole(userRole).subscribe((newUsers: any[]) => {
          this.getUserList(newUsers);
          this.editMode = false;
          this.alert = false;
        });
      }
    } else {
      this.alert = true;
      this.alertMsg = 'no user selected';
    }
  }


  //Remove user
  removeUsers(name: string) {
    if (confirm(`Are you sure want to remove ${name}`)) {
      this.userInteractionService.removeUser({userName: name}).subscribe((data: any[]) => {
        this.getUserList(data);
        this.editMode = false;
      });
    }

  }2
}
