//Imports
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthenticationService } from '../service/user-authentication.service';
import { UserInteractionService } from '../service/user-interaction.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  user = { userName: '', password: ''};
  alertMsg = '';
  validUser = false; //Bool value to determine if a user is valid
  alert = false; //Bool value to determine if the alert message should be shown


  constructor(private router: Router, private userAuth: UserAuthenticationService, private userInteract: UserInteractionService) { }
  ngOnInit() {}

  displayAlert(msg: string) {
    this.validUser = true;
    this.alert = true;
    this.alertMsg = msg;
  }
  dismissAlert() {
    this.validUser = true;
    this.alert = false;
    this.alertMsg = '';
  }

  /// Login Function \\\

  login() { 
    //Input validation
    let inputValid = false;
    if (this.user.userName === '' || this.user.userName === '') {
      inputValid = false;
      this.displayAlert('No username or password, please make sure you entered both');
    } else {
      inputValid = true;
      this.dismissAlert();
    }

    //If valid input, continue. 
    if (inputValid) {
      // Subscribe to user detail
      this.userAuth.login(this.user).subscribe((data: any) => {
        //Check if user exist.
        if (data.status === undefined) {
          //Store user into local storage
          localStorage.setItem('userName', data.userName);
          localStorage.setItem('superAdmin', data.superAdmin);
          localStorage.setItem('groupAdmin', data.groupAdmin);

          //Pass observable 
          this.userAuth.isValid(data);

          //Reset value
          this.user = { userName: '', password: ''};
          this.router.navigateByUrl('/dashboard');
        }
        else {
          //Display error
          this.displayAlert(data.msg);
        }
      });
    }
  }

}
