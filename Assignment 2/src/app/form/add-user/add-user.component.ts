//Imports
import { Component, OnInit } from '@angular/core';
import { UserInteractionService } from '../../service/user-interaction.service';
import { Router } from '@angular/router';
import { User } from '../../model/collection';
import { ErrorAlert } from '../../model/common-methods';
declare const $: any; 

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})

export class AddUserComponent implements OnInit {


  //Display, and fetch user input
  inputName = '';
  inputEmail = '';
  inputPassword = '';
  superAdmin = false;
  groupAdmin = false;

  //Display alert element
  alert = new ErrorAlert();


  constructor(private userInteractionService: UserInteractionService, private router: Router) { }
  ngOnInit() {}

  //Reset input and alert (Cancel Button)
  reset() {
    this.inputEmail = '';
    this.inputName = '';
    this.inputPassword = '';
    this.superAdmin = false;
    this.groupAdmin = false;
    this.alert.closeAlert();
    $('#userModal').modal('hide');
  }


  //Create user
  addUser() {

    const emailRegex = new RegExp('^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-.]+(?:co|au|jp|com|org|net)$');
    const validEmail = emailRegex.test(this.inputEmail);
    const usernameRegex = new RegExp('^[a-zA-Z0-9_]+$');
    const validUsername = usernameRegex.test(this.inputName);

    //Check if inputs are empty
    if (this.inputName === '' || this.inputEmail === '' || this.inputPassword === '') {
      this.alert.showAlert('Error: All fields must be filled in');
    }

    else {
      if (!validEmail) {

        //Display alert if email address is not valid
        this.alert.showAlert('Error: Not valid email address, please check your email address');
      } else {
        if (!validUsername) {
          //Display alert if username is not valid
          this.alert.showAlert('Error: Not valid username, username should only contain letters, numbers and underscores');
        } else {
        
          //Check password length is more than 6 characters
          if (this.inputPassword.length < 6) {
            this.alert.showAlert('Error: Password is too short, password should contain more than 6 characters');
          } else {

            //Create new user
            const user = new User(this.inputName, this.inputEmail, this.inputPassword, '', false, this.superAdmin, this.groupAdmin, [], []);
            this.userInteractionService.addUser(user).subscribe((newUser: any) => {
              if (newUser.status === false) {

                //Display alert depending on the error
                this.alert.showAlert(newUser.msg);
              } else {
                this.userInteractionService.getUserList().subscribe(data => {
                  //Update dashboard's user list
                  this.userInteractionService.userListObservable(data);
                });
                this.reset(); //Reset inputs and alerts
                $('#userModal').modal('hide');
              }
            });
          }
        }
      }
    }
  }


}
