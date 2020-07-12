import { UsersProvider } from './../../providers/users/users';
import { MessageProvider } from './../../providers/message/message';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { TokenProvider } from '../../providers/token/token';
import io from 'socket.io-client';
import _ from 'lodash';
// import { CaretEvent, EmojiEvent } from '@ionic-tools/emoji-picker';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  @ViewChild(Content) contentDiv: Content;

  tabElement: any;
  message: string;
  receiverName: any;
  receiverId: any;
  receiver: any;
  sender: any;
  msgArray = [];
  socket: any;

  typingMessage;
  typing = false;
  isOnline = false;

  // public eventMock;
  // public eventPosMock;

  // public direction = Math.random() > 0.5 ? (Math.random() > 0.5 ? 'top' : 'bottom') : (Math.random() > 0.5 ? 'right' : 'left');
  // public toggled = false;
  // public content = ' ';

  // private _lastCaretEvent: CaretEvent;

  constructor(public navCtrl: NavController, public navParams: NavParams, private messageProvider: MessageProvider,
    private tokenProvider: TokenProvider, private usersProvider: UsersProvider) {
    this.socket = io('http://localhost:3000');
    this.tabElement = document.querySelector('.tabbar.show-tabbar');
    this.receiverId = this.navParams.get('receiverId');
    this.receiverName = this.navParams.get('receiverName');
    this.GoToBottom();
  }

  ionViewDidLoad() {

    this.init();
    this.GetReceiverData();

    this.socket.on('refreshPage', () => {
      this.GoToBottom();
      this.init();
    });

    this.SocketInit();
  }

  init() {
    this.tokenProvider.GetPayload().then(value => {
      this.sender = value;
      this.GetAllMessages(this.sender._id, this.receiverId);
      const val = {
        room: 'global',
        user: this.sender.username
      }
      this.socket.emit('online', val);

      const params = {
        room1: this.sender.username,
        room2: this.receiverName
      }
      this.socket.emit('join chat', params);
    });
  }

  SocketInit() {
    this.socket.on('is_typing', data => {
      if (data.sender === this.receiverName) {
        this.typing = true;
      }
    });

    this.socket.on('has_stopped_typing', data => {
      if (data.sender === this.receiverName) {
        this.typing = false;
      }
    });

    this.socket.on('usersOnline', data => {
      const result = _.indexOf(data, this.receiverName);
      if (result > -1) {
        this.isOnline = true;
      } else {
        this.isOnline = false;
      }
    });
  }

  ionViewWillEnter(){
    (this.tabElement as HTMLElement).style.display = 'none';
   }

   ionViewWillLeave(){
    (this.tabElement as HTMLElement).style.display = 'flex';
   }

   GetReceiverData() {
    this.usersProvider.GetUserByUsername(this.receiverName).subscribe(data => {
      this.receiver = data.result;
    });
   }

   GetAllMessages(senderId, receiverId) {
    this.messageProvider.GetAllMessages(senderId, receiverId).subscribe(data => {
      this.msgArray = data.messages.message;
    });
   }

   SendPrivateMsg() {
    if(!this.message) {
      return;
    }
    this.messageProvider.SendMessage(this.sender._id, this.receiverId, this.receiverName, this.message).subscribe(data => {
      this.socket.emit('refresh', {});
      this.message = '';
    }, err => console.log(err));
   }

  //  HandleSelection(event: EmojiEvent) {
  //   this.content = this.content.slice(0, this._lastCaretEvent.caretOffset) + event.char +
  //    this.content.slice(this._lastCaretEvent.caretOffset);
  //   this.eventMock = JSON.stringify(event);
  //   this.message = this.content;
  //   this.toggled = !this.toggled;
  //   this.content = '';
  // }

  // HandleCurrentCaret(event: CaretEvent) {
  //   this._lastCaretEvent = event;
  //   this.eventPosMock = `{ caretOffset : ${event.caretOffset}, caretRange: Range{...}, textContent: ${event.textContent} }`;
  // }

  // Toggled() {
  //   this.toggled = !this.toggled;
  // }

  IsTyping() {
    this.socket.emit('start_typing', {
      sender: this.sender.username,
      receiver: this.receiverName
    });

    if (this.typingMessage) {
      clearTimeout(this.typingMessage);
    }

    this.typingMessage = setTimeout(() => {
      this.socket.emit('stop_typing', {
        sender: this.sender.username,
        receiver: this.receiverName
      });
    }, 500);
  }

   GoToBottom() {
     setTimeout(() => {
      if(this.contentDiv._scroll) {
        this.contentDiv.scrollToBottom();
      }
     }, 500);
   }

   GoBack() {
     this.navCtrl.pop();
   }

}
