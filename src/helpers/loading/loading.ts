import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class LoadingMessages {

  loader: any;

  constructor(public loadingCtrl: LoadingController) {}

  create(message) {
    this.hide(0);
    this.loader = this.loadingCtrl.create({
      content: message
    });
    this.loader.present();
  }

  hide(duration) {
    if (!this.loader) {
      return;
    }
    if (duration === 0) {
      this.clean();
    } else {
      setTimeout(() => {
        this.clean();
      }, duration);
    }
  }
  clean() {
    if (!this.loader) {
      return;
    }
    this.loader.dismiss();
    this.loader = null;
  }
}
