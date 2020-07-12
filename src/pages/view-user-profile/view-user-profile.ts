import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

@IonicPage()
@Component({
  selector: 'page-view-user-profile',
  templateUrl: 'view-user-profile.html',
})
export class ViewUserProfilePage {

  tabElement: any;
  userData: any;
  userprofile: string;
  headerImage: any;
  userFriends: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sanitizer: DomSanitizer,
    private popOverCntrl: PopoverController) {
    this.tabElement = document.querySelector('.tabbar.show-tabbar');
    this.userData = this.navParams.get('userData');
    this.userprofile = 'posts';
  }

  ionViewDidLoad() {
    this.UserImage();
  }

  ionViewWillEnter(){
    (this.tabElement as HTMLElement).style.display = 'none';
   }

   ionViewWillLeave(){
    (this.tabElement as HTMLElement).style.display = 'flex';
   }

   UserImage() {
    const imgUrl = `https://res.cloudinary.com/mihirb/image/upload/v${this.userData.picVersion}/${this.userData.picId}`;
    this.headerImage = this.sanitizer.bypassSecurityTrustStyle(`url(${imgUrl})`);
   }

   SegmentChanged(event) {
     if(event._value === 'following') {
      this.userFriends = {
        isFollowing: true,
        user: this.userData
      }
     }
     if(event._value === 'followers') {
      this.userFriends = {
        isFollowing: false,
        user: this.userData
      }
     }
   }

   ChatPage(value) {
    this.navCtrl.push('ChatPage', {
      receiverId: value._id,
      receiverName: value.username
    });
   }

   OpenPopOver(event, value) {
    let popover = this.popOverCntrl.create('PopOverPage', {
      user: value
    });
    popover.present({
      ev: event
    });
   }

}
