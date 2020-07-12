import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-user-friends',
  templateUrl: 'user-friends.html'
})
export class UserFriendsComponent implements OnChanges {
  @Input() friends;
  followingArray = [];
  followersArray = [];
  following = false;
  followers = false;

  constructor() {
  }

  ngOnChanges() {
    console.log('this friends', this.friends);
    if(this.friends && this.friends.isFollowing) {
      this.following = true;
      this.followers = false;
      this.followingArray = this.friends.user.following
    }
    if(this.friends && !this.friends.isFollowing) {
      this.following = false;
      this.followers = true;
      this.followersArray = this.friends.user.followers
    }
  }

}
