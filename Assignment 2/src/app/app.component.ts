//Imports
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthenticationService } from './service/user-authentication.service';
import { UserInteractionService } from './service/user-interaction.service';
import { FileUploadService } from './service/file-upload.service';
declare const $: any;
const avatarPath = 'http://localhost:3000/userAvatar?fileName='; //Avatar Path

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  /// App Definition  \\\
  loggedIn = false;

  //Role Badge
  superAdminBadge = '';
  groupAdminBadge = ''; 

  userData = {};
  groupData = [];

  userAvatar = 'assets/defaultAvatar.png';
  imageFile = null; 
  confirmUpload = false; 
  uploading = false; //Display loading spinner if true


  /// Display \\\
  constructor(private router: Router,
              private userAuth: UserAuthenticationService,
              private userInteractionService: UserInteractionService,
              private fileUploadService: FileUploadService) {
                //Display nav if logged in
                this.userAuth.userStatus$.subscribe((result) => {
                  this.loginSuccess();
                  this.displayNav(result);
                  console.log(result);
                });
                //Update side nav when group is created
                this.userInteractionService.groupListObserver.observer$.subscribe(data => {
                  this.getGroupList(data);
                });
 }

  //Assign data
  ngOnInit() {
    //Refresh page
    if (localStorage.getItem('userName') != null) {
      this.loginSuccess();
      this.userInteractionService.getUserDetail({userName: localStorage.getItem('userName')}).subscribe(data => {
        this.displayNav(data);
      });
    } else {
      this.loginUnsuccess();
    }
  }

  //Side nav
  displayNav(userData: any) {
    //Update view
    this.userData = userData;
    this.superAdminBadge = (userData.superAdmin) ? 'Super Admin' : '';
    this.groupAdminBadge = (userData.groupAdmin) ? 'Group Admin' : '';
    //User avatar
    if (userData.userAvatar !== '' ) {
      this.userAvatar = avatarPath + userData.userAvatar;
    } else {
      this.userAvatar = 'assets/defaultAvatar.png';
    }
    //Get group and channel lists
    this.userInteractionService.getGroupList().subscribe((groupData: any) => {
      //Get full group list if user is super Admin or group Admin
      if (userData.superAdmin || userData.groupAdmin) {
        this.getGroupList(groupData);
      }
      else {
      //Get subscribed group list if normal user
        const newGroupData = [];
        userData.groupList.forEach(userGroup => {
          groupData.forEach(data => {
            if (userGroup === data.groupName) {
              newGroupData.push(data);
            }
          });
        });
        this.getGroupList(newGroupData);
      }
    });
  }

  //Compare data
  getGroupList(groupArray: any[]) {
    groupArray.forEach((group) => {
      group.groupName = group.groupName.split(' ').join('-');
    });
    this.groupData = groupArray;
  }

  //Redirect to dashboard if user is logged in
  loginSuccess() {
    this.loggedIn = true;
    this.router.navigateByUrl('/dashboard');
  }

  //Redirect to login page if user is not logged in
  loginUnsuccess() {
    this.loggedIn = false;
    this.userData = {};
    this.groupData = [];
    this.router.navigateByUrl('/login');
  }

  //Logout user, clear local storage data, redirect user back to login page
  logout() {
    localStorage.clear();
    this.loginUnsuccess();
  }

  //Direct to group detail page
  displayGroupDetail(name: string) {
    name = name.split('-').join(' ');
    this.userInteractionService.getGroupDetail({ groupName: name });
    this.router.navigateByUrl('/group');
  }

  //Direct to channel page
  toChannel(gpName: string, chName: string) {
    gpName = gpName.split('-').join(' ');
    this.userInteractionService.getChannelDetail({ channelName: chName, groupName: gpName });
    this.userInteractionService.getGroupDetail({ groupName: gpName });
    this.router.navigateByUrl('/channel');
  }


  /// Image \\\

  //Update image
  changeAvatar(files) {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.userAvatar = event.target.result;
    };
    reader.readAsDataURL(files[0]);
    this.confirmUpload = true;
    this.imageFile = files[0];
  }

  //Upload image to server,save filePath to database, display new avatar
  upload() {
    this.confirmUpload = false;
    this.uploading = true;
    //Create new formData 
    const form = new FormData();
    form.append('file', this.imageFile, this.imageFile.name);
    //Upload file
    this.fileUploadService.uploaduserAvatar(form).subscribe((data: any) => {
      if (data.status) {
        const newData = {
          userName: localStorage.getItem('userName'),
          userAvatar: data.msg
        };
        //Update database
        this.userInteractionService.edituserAvatar(newData).subscribe((result: any) => {
          this.uploading = false;
          this.userAvatar = avatarPath + result.userAvatar;
        });
      }
    });
  }
}
