// Angular components
import { Component } from '@angular/core';

// Ionic components
import { NavController } from 'ionic-angular';
import { NativeStorage } from 'ionic-native';

// Helpers
import { ToastMessages } from '../../helpers/toast';
import { TravelsConstants } from '../../helpers/travels-constants';
import { LoadingMessages } from '../../helpers/loading';

// Pages
import { TravelsLoginPage } from '../travels-login';
import { TravelsHomePage } from '../travels-home';

// Providers
import { TravelsService } from '../../providers/travels-service'

@Component({
    selector: 'travels-invoices-recipe-page',
    templateUrl: './travels-invoices-recipe.html'
})

export class TravelsInvoicesRecipePage {

    /**
     * @property _loading
     * @description Model to show/hide the loading indicator
     */
    public _loading: boolean = false;

    /**
     * @property _messages
     * @description Used to store the travelsConstants messages.
     */
    private _messages: Object = {};

    public _param: string = '';

    /**
     * @constructor TravelsfirstPage
     */
    constructor (
        private navCtrl: NavController,
        private toastMessages: ToastMessages,
        private travelsConstants: TravelsConstants,
        private loadingMessages: LoadingMessages,
        private travelsService: TravelsService
    ) {
        // Store the travels constants messages in component property
        this._messages = this.travelsConstants._messages;
    }
    /**
     * @function showToastMessage
     * @description Method to show a toast message
     * @param {string} message [description]
     * @param {number} time    [description]
     */
    private showToastMessage(message: string, time: number): void {
        this.toastMessages.show(message);
        this.toastMessages.hide(time);
    }


    /**
     * @function goLogin
     * @description Logout and set root nav to travels login page
     */
    private goLogin(): void {
        this.travelsService.logout()
        .then(responseLogout => {
            this.navCtrl.setRoot(TravelsLoginPage);
        })
        .catch(errorLogout => {
            this.showToastMessage(this._messages['userLogoutFail'], 4000);
        });
    }

    private goToHome(): void {
        this.navCtrl.setRoot(TravelsHomePage);
    }

    /**
     * @function ionViewDidLoad
     * @description Method used when the view is loaded
     */
    public ionViewDidLoad(): void {
        NativeStorage.getItem('tSessionToken')
        .then(responseStorage => {
            this._param = responseStorage;
            console.log('responseStorage', responseStorage);
        })
        .catch(errorStorage => {
            this._param = 'fail';

            console.log('responseStorage', errorStorage);
        });
    }
}
