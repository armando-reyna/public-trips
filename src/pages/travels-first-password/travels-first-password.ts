// Angular components
import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

// Ionic components
import { NavController } from 'ionic-angular';

// Helpers
import { ToastMessages } from '../../helpers/toast';
import { TravelsConstants } from '../../helpers/travels-constants';
import { LoadingMessages } from '../../helpers/loading';

// Pages
import { TravelsLoginPage } from '../travels-login';

// Providers
import { TravelsService } from '../../providers/travels-service'

@Component({
    selector: 'travels-first-password-page',
    templateUrl: './travels-first-password.html'
})

export class TravelsFirstPasswordPage {

    /**
     * @property _firstButtonText
     * @description Used to set text in the first button
     */
    public _firstButtonText = 'Enviar';

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

    /**
     * @property _formFirstGroup
     * @description Model for login form
     */
    public _formFirstGroup: FormGroup;

    /**
     * @property _firstStatus
     * @description Used to show/hide form or success message
     * 'form': When show the first form
     * 'success': When show the success message
     */
    public _firstStatus: string = 'form';

    /**
     * @property _groupFirstSettings
     * @description Used to store the form validations and settings
     */
    private _groupFirstSettings: Object = { password: ['', Validators.required]};

    /**
     * @constructor TravelsfirstPage
     */
    constructor (
        private navCtrl: NavController,
        private toastMessages: ToastMessages,
        private travelsConstants: TravelsConstants,
        private formBuilder: FormBuilder,
        private loadingMessages: LoadingMessages,
        private travelsService: TravelsService
    ) {
        // Store the travels constants messages in component property
        this._messages = this.travelsConstants._messages;

        // Settings validations for first form
        this._formFirstGroup = this.formBuilder.group(this._groupFirstSettings);
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

    /**
     * @function resetForm
     * @description Clear the first form
     */
    private resetForm(): void {
        this._formFirstGroup.reset();
    }

    /**
     * @function changeFirstPassword
     * @description Call the service to reset the user password
     */
    private changeFirstPassword(): void {
        this.showLoading('Actualizando password...');

        this.travelsService.updatePassword(this._formFirstGroup.value)
        .subscribe(responseUpdate => {
            this.resetForm();
            this.hideLoading();
            this._firstStatus = 'success';
        }, errorUpdate => {
            this.showToastMessage(this._messages['userServiceFail'], 4000);
            this.hideLoading();
        })
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

    /**
     * @function ionViewDidLoad
     * @description Method used when the view is loaded
     */
    public ionViewDidLoad(): void {}
}
