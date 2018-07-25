import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { AppVersion } from 'ionic-native';

@Injectable()
export class AppInfo {

  version: string;
  code: string;
  num: string;

  constructor(public plt: Platform) {}

  get() {
    return new Promise((resolve, reject) => {
      let codePromise = new Promise((resolve, reject) => {
        AppVersion.getVersionCode().then((c) => {
          this.code = c;
          resolve(this.code);
        }, error => {
          reject(false);
        });
      });

      let numberPromise = new Promise((resolve, reject) => {
        AppVersion.getVersionNumber().then((n) => {
          this.num = n;
          resolve(this.num)
        }, error => {
          reject(false);
        });
      });

      Promise.all([codePromise, numberPromise]).then(r => {
        if (this.plt.is('ios')) {
          console.log('En iOS. Code:' + this.code + ' Num:' + this.num  )
          this.version = this.num + ' (' + this.code + ')' ;
          resolve(this.version);
        } else {
          console.log('En android. Code' + this.code + ' Num:' + this.num )
          this.version ='0.0.1' + ' (' + this.num + ')';
          resolve(this.version);
        }
      }, error => {
        reject(false);
      });
    });
  }

}
