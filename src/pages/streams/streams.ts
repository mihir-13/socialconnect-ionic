import { PostProvider } from './../../providers/post/post';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import moment from 'moment';
import io from 'socket.io-client';
import _ from 'lodash';
import { TokenProvider } from '../../providers/token/token';

@IonicPage()
@Component({
  selector: 'page-streams',
  templateUrl: 'streams.html',
})
export class StreamsPage {

  stream: string = 'post';
  streamsArray = [];
  topStreamArray = [];
  socket: any;
  user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private postProvider: PostProvider,
    private tokenProvider: TokenProvider, private modalCntrl: ModalController) {
    this.socket = io('http://localhost:3000');
  }

  ionViewDidLoad() {
    this.tokenProvider.GetPayload().then(value => {
      this.user = value;
    });
    this.GetAllPosts();
    this.socket.on('refreshPage', () => {
      this.GetAllPosts();
    });
  }

  GetAllPosts() {
    this.postProvider.GetAllPost().subscribe(data => {
      this.streamsArray = data.posts;
      this.topStreamArray = data.top;
    }, err => {
      if (err.error.token === null) {
        console.log('error token expired', err.error.token);
        this.tokenProvider.DeleteToken();
        this.navCtrl.setRoot('LoginPage');
      }
    });
  }

  LikePost(post) {
    this.postProvider.AddLikePost(post).subscribe(data => {
      this.socket.emit('refresh',{});
    });
  }

  PostModal() {
    console.log('clicked');
    let modal = this.modalCntrl.create('PostPage');
    modal.present();
  }

  AddComment(post) {
    this.navCtrl.push('CommentsPage', {
      postData: post
    });
  }

  GetPostTime(time) {
    return moment(time).fromNow();
  }

  CheckInLikesArray(arr, username) {
    return _.some(arr, { username: username });
  }


}
