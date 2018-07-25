import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';



@Injectable()
export class ToastMessages {

  toast: any;

  constructor(public toastCtrl: ToastController) {}

  show(message) {
    console.log('ToastMessage', message);
    if (this.toast !== undefined) {
      this.toast.dismiss();
    }

    if (typeof message === 'object') {
      console.log(message.errors.indexOf('ServiceException'));
      for(let e of message.errors) {
        if(e.indexOf('ServiceException') == -1) {
          return false;
        }
      }
      if (message.message) {
        message = message.message;
      } else if (message.message === '' && message.title) {
        message = message.title;
      } else {
        message = 'Por el momento el servicio no está disponible, inténtelo mas tarde.';
      }
    }

    this.toast = this.toastCtrl.create({
      message: message,
    });
    this.toast.present();
  }

  hide(duration) {
    setTimeout(() => {
      if (this.toast !== undefined) {
        this.toast.dismiss();
        this.toast = undefined;
      }
    }, duration);
  }
}
