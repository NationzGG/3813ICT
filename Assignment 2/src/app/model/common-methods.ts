//Imports
import { Observable, Subject } from 'rxjs';

// Observe object
export class Observer {
  observer$: Observable<any>;
  subject = new Subject<any>();
}

//ErrorAlert, in charge of display the alert or not
export class ErrorAlert {
  show = false;
  msg = '';

//Display alert
showAlert(message: string) {
    this.show = true;
    this.msg = message;
  }

  //Reset aler
  closeAlert() {
    this.show = false;
    this.msg = '';
  }
}

//Message structure
export class Message {
  announcement;
  userName;
  userAvatar;
  message;
  image;
  imagePath;
  selfMessage;
  
  constructor(
    announcement: boolean, userName: string,  userAvatar: string,
    message: string, image: boolean, imagePath: string, selfMessage: boolean ) {
    this.announcement = announcement;
    this.userName = userName;
    this.userAvatar =  userAvatar;
    this.message = message;
    this.image = image;
    this.imagePath = imagePath;
    this.selfMessage = selfMessage;

  }
}
