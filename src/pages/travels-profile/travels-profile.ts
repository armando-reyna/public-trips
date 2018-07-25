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
import { TravelsFirstPasswordPage } from '../travels-first-password';
import { TravelsSendEmailPage } from '../travels-send-email/travels-send-email';

// Providers
import { TravelsService } from '../../providers/travels-service'


@Component({
    selector: 'travels-profile-page',
    templateUrl: './travels-profile.html'
})

export class TravelsProfilePage {

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
    private _userData: Object = {};
    public _rfcData: object = {};
    public _emailRfc = ' ';

    /**
     * @constructor
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
     * @function hideLoading
     * @description Method to hide the loading indicator and change the model
     * _loading to false status.
     */
    private hideLoading(): void {
        this._loading = false;
        this.loadingMessages.hide(0);
    }

    /**
     * @function showLoading
     * @description Method to show the loading indicator
     * @param {string} message string message to show
     */
    private showLoading(message: string): void {
        this._loading = true;
        this.loadingMessages.create(message);
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

    public logout(): void {
        this.showLoading('Cerrando sesión...');

        this.travelsService.logout()
        .then(responseLogout => {
            this.navCtrl.setRoot(TravelsLoginPage);
            this.hideLoading();
        })
        .catch(errorLogout => {
            this.hideLoading();
            this.showToastMessage(this._messages['userLogoutFail'], 4000);
        });
    }

    public goToChangePassword(): void {
        this.navCtrl.push(TravelsFirstPasswordPage);
    }

    public goToSendEmail(): void {
        this.navCtrl.push(TravelsSendEmailPage);
    }

    /**
     * @function ionViewDidLoad
     * @description Method used when the view is loaded
     */
    public ionViewDidLoad(): void {}

    /**
     * @function ionViewWillEnter
     * @description Method used before the view is loaded
     */
    public ionViewWillEnter(): void {
        this.showLoading('Obteniendo información...');

        NativeStorage.getItem('currentUser')
        .then(responseGet => {
            console.log(responseGet);
            this._userData = JSON.parse(responseGet);
            this._emailRfc = this._userData['emailInvoce'];

            this.travelsService.getRfc()
            .subscribe(responseRfc => {
                this._rfcData = responseRfc[0];
                this.hideLoading();
            }, errorRfc => {
                this.showToastMessage(this._messages['rfcImageFail'], 5000);
                this.hideLoading();
            });
        })
        .catch(errorGet => {
            this.showToastMessage(this._messages['userSessionFail'], 5000);
            this.logout();
        });
    }
}
