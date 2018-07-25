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
    selector: 'travels-recovery-page',
    templateUrl: './travels-recovery.html'
})

export class TravelsRecoveryPage {

    /**
     * @property _recoveryButtonText
     * @description Used to set text in the recovery button
     */
    public _recoveryButtonText = 'Enviar';

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
     * @property _formRecoveryGroup
     * @description Model for login form
     */
    public _formRecoveryGroup: FormGroup;

    /**
     * @property _recoveryStatus
     * @description Used to show/hide form or success message
     * 'form': When show the recovery form
     * 'success': When show the success message
     */
    public _recoveryStatus: string = 'form';

    /**
     * @property _groupRecoverySettings
     * @description Used to store the form validations and settings
     */
    private _groupRecoverySettings: Object = {
        username: ['',
            [
                Validators.required,
                Validators.pattern(this.travelsConstants._emailPattern)
            ]
        ]
    };

    /**
     * @constructor TravelsRecoveryPage
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

        // Settings validations for recovery form
        this._formRecoveryGroup = this.formBuilder.group(this._groupRecoverySettings);
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
     * @description Clear the recovery form
     */
    private resetForm(): void {
        this._formRecoveryGroup.reset();
    }

    /**
     * @function recoveryPassword
     * @description Call the service to reset the user password
     */
    private recoveryPassword(): void {
        this.showLoading('Espera...');

        this.travelsService.resetPassword(this._formRecoveryGroup.value)
        .subscribe(responseReset => {
            this.resetForm();
            this.hideLoading();
            this._recoveryStatus = 'success';
        }, errorReset => {
            this.showToastMessage(this._messages['userServiceFail'], 4000);
            this.hideLoading();
        });
    }

    private goLogin(): void {
        this.navCtrl.setRoot(TravelsLoginPage);
    }

    /**
     * @function ionViewDidLoad
     * @description Method used when the view is loaded
     */
    public ionViewDidLoad(): void {}
}
