import { Injectable, NgZone } from '@angular/core';
import { Network } from 'ionic-native';


@Injectable()
export class NetworkStatus {

  toast: any;
  status: string = 'connected';
  connectSubscription: any;
  disconnectSubscription: any;

  constructor(
    public zone: NgZone
  ) {
    if(window['Connection']) {
      if(navigator['connection'].type == window['Connection'].NONE) {
        this.status = 'disconnected';
      }
    }
    console.log('NETWORK', window, navigator);
  }

  isEnabled() {
    console.log('IS ENABLE NETWORK');
    return new Promise((resolve, reject) => {
      if (Network.type !== 'none') {
        resolve(true);
      } else {
        reject(false);
      }
    });
  }

  checkDisconnection() {
    // watch network for a disconnect
    this.disconnectSubscription = Network.onDisconnect().subscribe(() => {
      console.log('network was disconnected');

      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.status = 'disconnected';
      });
    });
  }

  checkConnection() {
    // watch network for a connection
    this.connectSubscription = Network.onConnect().subscribe(() => {
      console.log('network connected!');
      // We just got a connection but we need to wait briefly
       // before we determine the connection type.  Might need to wait
      // prior to doing any api requests as well.
      console.log(Network.type);
      setTimeout(() => {
        let ionApp = document.getElementsByTagName('ion-tabs');
        if (ionApp.length > 0) {
          let menu = ionApp[0].getElementsByTagName('div');
          if (menu.length > 0) {
            let homeTab = menu[0].getElementsByTagName('a')[0];
            if (homeTab.getAttribute("aria-selected") === 'true') {
              console.log('gMaps status', window['google']);
              if (!window['google']) {
                window.location.reload(true);
              }
            }
          }
        }
        if (Network.type === 'wifi') {

        }
        this.zone.run(() => {
          this.status = 'connected';
        });

      }, 3000);
    });
  }

  stopCheckingDisconnection() {
    // stop connect watch
    this.connectSubscription.unsubscribe();
  }

  stopCheckingConnection() {
    // stop disconnect watch
    this.disconnectSubscription.unsubscribe();
  }
}
