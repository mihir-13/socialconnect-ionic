import { MessageProvider } from './../../providers/message/message';
import { UsersProvider } from './../../providers/users/users';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TokenProvider } from '../../providers/token/token';
import moment from 'moment';
import _ from 'lodash';
import io from 'socket.io-client';

@IonicPage()
@Component({
  selector: 'page-chat-list',
  templateUrl: 'chat-list.html',
})
export class ChatListPage {

  token: any;
  chatList = [];
  socket: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private usersProvider: UsersProvider,
    private tokenProvider: TokenProvider, private messageProvider: MessageProvider) {
      this.socket = io('http://localhost:3000');
  }

  ionViewDidLoad() {
    this.token = this.tokenProvider.GetPayload().then(value => {
      this.token = value;
      console.log('token', this.token);
      this.GetUser(this.token._id);
    });

    this.socket.on('refreshPage', () => {
      this.token = this.tokenProvider.GetPayload().then(value => {
        this.token = value;
        console.log('token', this.token);
        this.GetUser(this.token._id);
      });
    });
  }

  GetUser(id) {
    this.usersProvider.GetUserById(id).subscribe(data => {
      console.log('token data by id', data);
      this.chatList = data.result.chatList;
    });
  }

  GetMessageTime(time) {
    const todaysDate = new Date();
    const date = new Date(time);
    const d1 = moment(new Date(todaysDate));
    const d2 = moment(new Date(date));

    const d3 = d1.diff(d2, 'days');

    if (d3 === 0) {
      return moment(time).format('LT');
    } else {
      return moment(time).format('DD/MM/YYYY');
    }
  }

  ChatPage(chat) {
    this.navCtrl.push('ChatPage', {
      receiverId: chat.receiverId._id,
      receiverName: chat.receiverId.username
    });

    this.messageProvider.MarkMessages(this.token.username, chat.receiverId.username).subscribe(data => {
      console.log('chat page data', data);
      this.socket.emit('refresh', {});
    }, err => console.log(err));
  }

  CheckIfFalse(arr, name) {
    let total = 0;
    _.forEach(arr, val => {
      if(val.isRead === false && val.receivername !== name ) {
        total += 1;
      }
    });
    return total;
  }

}
