import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
const server = 'http://localhost:3000'; //Server
@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor( private httpClient: HttpClient ) { }

  //Upload avatar image
  uploaduserAvatar(file) {
    return this.httpClient.post(server + '/uploaduserAvatar', file);
  }

  //Upload chat image
  uploadChatImage(file) {
    return this.httpClient.post(server + '/uploadChatImage', file);
  }
}
