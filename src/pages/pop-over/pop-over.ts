import { UsersProvider } from './../../providers/users/users';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TokenProvider } from '../../providers/token/token';
import _ from 'lodash';
import io from 'socket.io-client';

@IonicPage()
@Component({
  selector: 'page-pop-over',
  templateUrl: 'pop-over.html',
})
export class PopOverPage {

  token: any;
  user: any;
  socket: any;
  following = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private usersProvider: UsersProvider, private tokenProvider: TokenProvider) {
      this.user = this.navParams.get('user');
      this.socket = io('http://localhost:3000');
  }

  ionViewDidLoad() {
    this.tokenProvider.GetPayload().then(value => {
      this.token = value;
      this.GetUser(this.token._id);
    });

    this.socket.on('refreshPage', () => {
      this.tokenProvider.GetPayload().then(value => {
        this.token = value;
        this.GetUser(this.token._id);
      });
    });
  }

  GetUser(id) {
    this.usersProvider.GetUserById(id).subscribe(data => {
      const result = _.find(data.result.following, [
        'userFollowed._id', this.user._id
      ]);
      if(result) {
        this.following = true;
      } else {
        this.following = false;
      }
    });
  }

  Follow() {
    this.usersProvider.FollowUser(this.user._id).subscribe(data => {
      this.socket.emit('refresh', {});
    }, err => console.log(err));
  }

  Unfollow() {
    this.usersProvider.UnFollowUser(this.user._id).subscribe(data => {
      this.socket.emit('refresh', {});
    }, err => console.log(err));
  }

}
