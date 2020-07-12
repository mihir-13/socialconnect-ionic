import { Component, Input, OnChanges } from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'app-posts',
  templateUrl: 'posts.html'
})
export class PostsComponent implements OnChanges {
  @Input() user;
  userPost = [];
  userData: any;

  constructor() {
  }

  ngOnChanges() {
    if(this.user) {
      this.userPost = this.user.posts.reverse();
      this.userData = this.user;
    }
  }

  GetPostTime(time) {
    return moment(time).fromNow();
  }

}
