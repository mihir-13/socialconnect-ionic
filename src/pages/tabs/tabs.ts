import { UsersProvider } from './../../providers/users/users';
import { TokenProvider } from './../../providers/token/token';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import _ from 'lodash';
import io from 'socket.io-client';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tabRoot1 = 'StreamsPage';
  tabRoot2 = 'ChatListPage';
  tabRoot3 = 'PeoplePage';
  tabRoot4 = 'NotificationPage';

  token: any;
  count = 0;
  msgCount = 0;
  socket: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private authProvider: AuthProvider,
    private tokenProvider: TokenProvider, private usersProvider: UsersProvider) {
      this.socket = io('http://localhost:3000');
  }

  ionViewDidLoad() {
    this.authProvider.GetAllUsers().subscribe(data => {
      console.log('DATAA', data);
    });

    this.tokenProvider.GetPayload().then(value => {
      this.token = value;
      this.GetUser(this.token._id, this.token.username);
    });
  }

  ClickTab() {
    this.socket.on('refreshPage', () => {
      this.tokenProvider.GetPayload().then(value => {
        this.token = value;
        this.GetUser(this.token._id, this.token.username);
      });
    });

    this.msgCount -= 1;
    if(this.msgCount <= 0) {
      this.msgCount = null;
    }

    this.count -= 1;
    if(this.count <= 0) {
      this.count = null;
    }
  }

  GetUser(id, username) {
    this.usersProvider.GetUserById(id).subscribe(data => {
      let msgArray = [];
      let countArray = [];
      _.forEach(data.result.chatList, value => {
        const msg = value.msgId.message;
        _.forEach(msg, val => {
          if(val.isRead === false && val.receivername === username) {
            msgArray.push(val);
            this.msgCount = msgArray.length;
          }
        });
      });
      _.forEach(data.result.notifications, value => {
        if(value.read === false) {
          countArray.push(value);
          this.count = countArray.length;
        }
      })
    });
  }

}
