import { TokenProvider } from './../../providers/token/token';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  username: string;
  email: string;
  password: string;
  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private authProviders: AuthProvider,
    private alertCntrl: AlertController, private tokenProvider: TokenProvider, private loadingCntrl: LoadingController) {
  }

  ionViewDidLoad() {

  }

  userRegister() {
    console.log('input fields', this.username, this.email, this.password);
    // this.tokenProvider.GetPayload().then(result => {
    //   console.log('result payload', result);
    // });
    this.ShowLoader();
    this.authProviders.RegisterUser(this.username, this.email, this.password).subscribe(data => {
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
      if(err.error.message) {
        this.ShowErrorAlert(err.error.message);
      }
    });
  }

  ShowErrorAlert(message){
    let alert = this.alertCntrl.create({
      title: 'Sign Up Error',
      subTitle: `${message}`,
      buttons: ['OK'],
      cssClass: 'alertcss'
    });
    alert.present();
  }

  ShowLoader() {
    this.loading = this.loadingCntrl.create({
      content: 'Authenticating...'
    });
    this.loading.present();
  }

}
