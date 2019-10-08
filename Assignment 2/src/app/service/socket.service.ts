import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
const server = 'http://localhost:3000'; //Server

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket;

  constructor() { }

  //Connect to socket
  socketInit(): void {
    this.socket = io(server);
  }
  //Emit message
  emitMsg(message): void {
    this.socket.emit('message', message);
  }
  //Close connection
  closeSocket(): void {
    console.log('called');
    this.socket.emit('manualDisconnect');
  }
  //Send channel detail
  sendChannelDetail(detail): void {
    this.socket.emit('channelData', detail);
  }
  //Message observer
  messageObserver(): Observable<any> {
    const observable = new Observable(observer => {
      this.socket.on('message', (msg: string) => observer.next(msg));
    });
    return observable;
  }
  //Announcement observer
  announcementObserver(): Observable<any> {
    const observable = new Observable(observer => {
      this.socket.on('announcement', (msg: string) => observer.next(msg));
    });
    return observable;
  }
  //History observer
  historyObserver(): Observable<any> {
    const observable = new Observable(observer => {
      this.socket.on('chatHistory', (msg: string) => observer.next(msg));
    });
    return observable;
  }
}
