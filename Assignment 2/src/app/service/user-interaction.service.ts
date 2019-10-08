//Imports
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observer } from '../model/common-methods';

const server = 'http://localhost:3000'; //server

// http options
const HTTP_OPTIONS = {
  headers: new HttpHeaders({ 'Content-type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserInteractionService {
  //New Observer
  actionObserver = new Observer();
  groupListObserver = new Observer(); // observe full group list
  groupDetailObserver = new Observer(); // observe group detail
  channelDetailObserver = new Observer(); // observe channel detail
  channelListObserver = new Observer();  // observe channel list
  userListObserver = new Observer(); // observe user list

  constructor(private httpClient: HttpClient, private router: Router) {
    //Assign Observables
    this.actionObserver.observer$ = this.actionObserver.subject.asObservable();
    this.groupListObserver.observer$ = this.groupListObserver.subject.asObservable();
    this.groupDetailObserver.observer$ = this.groupDetailObserver.subject.asObservable();
    this.channelDetailObserver.observer$ = this.channelDetailObserver.subject.asObservable();
    this.channelListObserver.observer$ = this.channelListObserver.subject.asObservable();
    this.userListObserver.observer$ = this.userListObserver.subject.asObservable();
  }


  //////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////OBSERVE///////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////

  //Action Observable Data
  actionObservable(action: any) {
    this.actionObserver.subject.next(action);
  }

  //Group List observable
  groupListObservable(groupList: any) {
    this.groupListObserver.subject.next(groupList);
  }

  //User List observable
  userListObservable(userList: any) {
    this.userListObserver.subject.next(userList);
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////FETCH/////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////

  //User List
  getUserList() {
    return this.httpClient.get(server + '/users');
  }

  //Group List
  getGroupList() {
    return this.httpClient.get(server + '/groupList');
  }

  //Group User List
  getGroupUser(groupName) {
    return this.httpClient.post(server + '/groupUserList', groupName, HTTP_OPTIONS);
  }

  //Channel List
  getChannelList(group) {
    return this.httpClient.post(server + '/channelList', group, HTTP_OPTIONS);
  }

  //Channel User
  getChannelUser(data) {
    return this.httpClient.post(server + '/channelUserList', data, HTTP_OPTIONS);
  }

  //User Detail
  getUserDetail(user) {
    return this.httpClient.post(server + '/userDetail', user, HTTP_OPTIONS);
  }

  //Group Detail
  getGroupDetail(group) {
    this.httpClient.post(server + '/groupDetail', group, HTTP_OPTIONS).subscribe((data: any) => {
      this.groupDetailObserver.subject.next(data);
    });
  }

  //Channel Detail
  getChannelDetail(channel) {
    this.httpClient.post(server + '/channelDetail', channel, HTTP_OPTIONS).subscribe((data: any) => {
      this.channelDetailObserver.subject.next(data);
    });
  }


  //////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////ADD///////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////

  //Add User
  addUser(user) {
    return this.httpClient.post(server + '/addUser', user, HTTP_OPTIONS);
  }

  //Add Group
  addGroup(group) {
    return this.httpClient.post(server + '/addGroup', group, HTTP_OPTIONS);
  }

  //Add Channel
  addChannel(channel) {
    return this.httpClient.post(server + '/addChannel', channel, HTTP_OPTIONS);
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////EDIT//////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////

  //Edit Role
  editRole(data) {
    return this.httpClient.post(server + '/editRole', data, HTTP_OPTIONS);
  }

  //Edit Avatar
  edituserAvatar(data) {
    return this.httpClient.post(server + '/edituserAvatar', data, HTTP_OPTIONS);
  }

  //Edit Group User
  editGroupUser(data) {
    return this.httpClient.post(server + '/editGroupUser', data, HTTP_OPTIONS);
  }

  //Edit Group User Role
  editGroupUserRole(data) {
    return this.httpClient.post(server + '/editGroupUserRole', data, HTTP_OPTIONS);
  }

  //Edit Channel Role
  editChannelUser(data) {
    return this.httpClient.post(server + '/editChannelUser', data, HTTP_OPTIONS);
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////REMOVE////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////


  //Remove Group
  removeGroup(data) {
    return this.httpClient.post(server + '/removeGroup', data, HTTP_OPTIONS);
  }

  //Remove Channel
  removeChannel(data) {
    return this.httpClient.post(server + '/removeChannel', data, HTTP_OPTIONS);
  }

  //Remove User
  removeUser(data) {
    return this.httpClient.post(server + '/removeUser', data, HTTP_OPTIONS);
  }

}
