import { TokenProvider } from './../../providers/token/token';
import { UsersProvider } from './../../providers/users/users';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import moment from 'moment';
import io from 'socket.io-client';

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

  payload: any;
  notifications = [];
  socket: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UsersProvider,
    private tokenProvider: TokenProvider) {
      this.socket = io('http://localhost:3000');
  }

  ionViewDidLoad() {
    this.tokenProvider.GetPayload().then(value => {
      this.payload = value;
      this.GetUser(this.payload._id);
    });

    this.socket.on('refreshPage', () => {
      this.tokenProvider.GetPayload().then(value => {
        this.payload = value;
        this.GetUser(this.payload._id);
      });
    });
  }

  GetUser(id) {
    this.userProvider.GetUserById(id).subscribe(data => {
      this.notifications = data.result.notifications.reverse();
    });
  }

  GetNotificationTime(time) {
    return moment(time).fromNow();
  }

  MarkNotification(value) {
    this.userProvider.MarkNotification(value._id).subscribe(data => {
      this.socket.emit('refresh', {});
    }, err => console.log(err));
  }

  DeleteNotification(value) {
    this.userProvider.MarkNotification(value._id, true).subscribe(data => {
      this.socket.emit('refresh', {});
    }, err => console.log(err));
  }

}
