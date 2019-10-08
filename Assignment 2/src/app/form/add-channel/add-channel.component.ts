import { Component, OnInit } from '@angular/core';
import { UserInteractionService } from '../../service/user-interaction.service';
import { UserAuthenticationService } from '../../service/user-authentication.service';
import { Channel } from '../../model/collection';
import { ErrorAlert } from '../../model/common-methods';
declare const $: any; // jquery

@Component({
  selector: 'app-add-channel',
  templateUrl: './add-channel.component.html',
  styleUrls: ['./add-channel.component.css']
})
export class AddChannelComponent implements OnInit {

  
  name = ''; // channel name
  groupName = ''; 
  groupChannelList = []; 

  alert = new ErrorAlert();

  /// Display \\\

  constructor(private userInteract: UserInteractionService, private userAuth: UserAuthenticationService) {
    //Fetch current group detail
    this.userInteract.groupDetailObserver.observer$.subscribe((data) => {
      this.groupName = data.groupName;
      this.groupChannelList = data.groupChannel;
    });
  }

  ngOnInit() {}

  //Reset inputs and alerts when cancel button is pressed
  reset() {
    //Fetch updates for group detail page
    this.userInteract.getGroupDetail({ groupName: this.groupName });
    this.name = '';
    this.alert.closeAlert();
    $('#channelModal').modal('hide');
  }

  /// Database \\\

  // Add Channel and send data to server
  addChannel() {
    //Check if the name is empty, if not empty proceed, else error
    if (this.name === '') {
      this.alert.showAlert('Error, all fields must be filled');
    } else {
      //check if the name contains any special characters
      const nameRegex = new RegExp('[^a-zA-Z0-9 ]');
      const specialCharacters = nameRegex.test(this.name);
      if (specialCharacters) {
        this.alert.showAlert('Error, channel name should only contain letters, numbers and spaces');
      } else {
        this.alert.closeAlert();
        const newChannel = new Channel(this.name, this.groupName);
        const groupChannelList = this.groupChannelList;
        groupChannelList.push(this.name);

        //Send object to server and subscribe response
        this.userInteract.addChannel([newChannel, groupChannelList]).subscribe((data: any) => {
          if (!data.status) {
            this.alert.showAlert(data.msg);
            groupChannelList.pop();
          } else {
            //Fetch update for group detail page
            this.userInteract.getGroupDetail({ groupName: this.groupName });
            //Fetch update for side nav
            this.userInteract.getGroupList().subscribe((groupDataList) => {
              this.userInteract.groupListObservable(groupDataList);
            });
            this.name = '';
            this.alert.closeAlert();
            $('#channelModal').modal('hide');
          }
        });
      }
    }
  }


}
