import { PostProvider } from './../../providers/post/post';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import moment from 'moment';
import io from 'socket.io-client';

@IonicPage()
@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {

  post: any;
  tabElement: any;
  commentsArray = [];
  commentTxtArea: string;
  socket: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private postProvider: PostProvider) {
    this.socket = io('http://localhost:3000');
    this.tabElement = document.querySelector('.tabbar.show-tabbar');
    this.post = this.navParams.get('postData');
  }

  ionViewDidLoad() {
    this.GetSinglePost();
    this.socket.on('refreshPage', () => {
      this.GetSinglePost();
    });
  }

  ionViewWillEnter(){
   (this.tabElement as HTMLElement).style.display = 'none';
  }

  ionViewWillLeave(){
   (this.tabElement as HTMLElement).style.display = 'flex';
  }

  GetSinglePost() {
    this.postProvider.GetPost(this.post._id).subscribe(data => {
      console.log('Post comment', data);
      this.commentsArray = data.post.comments;
    });
  }

  AddCommentEvent() {
    if(this.commentTxtArea) {
      this.postProvider.AddComment(this.post._id, this.commentTxtArea).subscribe(data => {
        this.commentTxtArea = '';
        this.socket.emit('refresh',{});
      }, err => console.log(err));
    }
  }

  GetCommentTime(time) {
    return moment(time).fromNow();
  }

}
