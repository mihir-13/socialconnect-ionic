import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { TokenProvider } from '../../providers/token/token';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loading: any;
  username: string;
  password: string;
  tabElement: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private authProviders: AuthProvider,
    private alertCntrl: AlertController, private tokenProvider: TokenProvider, private loadingCntrl: LoadingController) {
      this.tabElement = document.querySelector('.tabbar.show-tabbar');
  }

  ionViewDidLoad() {
    if (this.tabElement) {
      (this.tabElement as HTMLElement).style.display = 'none';
    }
  }

  LoginUser() {
    console.log(this.username, this.password);
    this.ShowLoaderForLogIn();
    this.authProviders.LoginUser(this.username, this.password).subscribe(data => {
      this.tokenProvider.SetToken(data.token);
      setTimeout(() => {
        this.loading.dismiss();
        this.navCtrl.setRoot('TabsPage');
      }, 2000);
    }, err => {
      this.loading.dismiss();
      if (err.error.msg) {
        this.ShowErrorAlert(err.error.msg[0].message)
      }
      if (err.error.message) {
        this.ShowErrorAlert(err.error.message);
      }
    });
  }

  ShowErrorAlert(message) {
    let alert = this.alertCntrl.create({
      title: 'Log In Error',
      subTitle: `${message}`,
      buttons: ['OK'],
      cssClass: 'alertcss'
    });
    alert.present();
  }

  rPage() {
    this.ShowLoader();
    setTimeout(() => {
      this.loading.dismiss();
      this.navCtrl.push('RegisterPage');
    }, 500);
    console.log('rpageclicked');
  }

  forLogin() {
    console.log('loging clicked');
  }

  ShowLoaderForLogIn() {
    this.loading = this.loadingCntrl.create({
      content: 'Loggin In...'
    });
    this.loading.present();
  }

  ShowLoader() {
    this.loading = this.loadingCntrl.create({
      content: 'Loading...'
    });
    this.loading.present();
  }

}
