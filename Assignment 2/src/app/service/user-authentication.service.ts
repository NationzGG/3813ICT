//Imports
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

const server = 'http://localhost:3000'; //server

// http options
const HTTP_OPTIONS = {
  headers: new HttpHeaders({ 'Content-type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class UserAuthenticationService {

  //Observe current data status
  userStatus$: Observable<any>;
  private statusSubject = new Subject<any>();

  constructor(private httpClient: HttpClient) {
    this.userStatus$ = this.statusSubject.asObservable();
  }

  isValid(valid: object) {
    this.statusSubject.next(valid);
  }

  login(user) {
    return this.httpClient.post(server + '/login', user, HTTP_OPTIONS);
  }
}
