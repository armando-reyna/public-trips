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
import { TravelsProfilePage } from '../travels-profile/travels-profile';

// Providers
import { TravelsService } from '../../providers/travels-service'

@Component({
    selector: 'travels-send-email-page',
    templateUrl: './travels-send-email.html'
})

export class TravelsSendEmailPage {

    /**
     * @property _sendEmailButtonText
     * @description Used to set text in the recovery button
     */
    public _sendEmailButtonText = 'Enviar';

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
     * @property _formSendEmailGroup
     * @description Model for send email form
     */
    public _formSendEmailGroup: FormGroup;

    /**
     * @property _sendEmailStatus
     * @description Used to show/hide form or success message
     * 'form': When show the recovery form
     * 'success': When show the success message
     */
    public _sendEmailStatus: string = 'form';

    /**
     * @property _groupSendEmailSettings
     * @description Used to store the form validations and settings
     */
    private _groupSendEmailSettings: Object = {
        emailBussiness: ['',
            [
                Validators.required,
                Validators.pattern(this.travelsConstants._emailPattern)
            ]
        ],
        nameBussiness: ['', Validators.required],
        commentBussiness: ['', Validators.required]
    };

    /**
     * @constructor TravelsSendEmailPage
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
        this._formSendEmailGroup = this.formBuilder.group(this._groupSendEmailSettings);
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
        this._formSendEmailGroup.reset();
    }

    /**
     * @function sendEmailBussiness
     * @description Call the service to reset the user password
     */
    private sendEmailBussiness(): void {
        this.showLoading(this._messages['sendEmailWait']);
        // this.resetForm();
        // this.hideLoading();
        // this._sendEmailStatus = 'success';

        this.travelsService.sendEmail(this._formSendEmailGroup.value)
        .subscribe(responseReset => {
            this.resetForm();
            this.hideLoading();
            this._sendEmailStatus = 'success';
        }, errorReset => {
            this.showToastMessage(this._messages['sendEmailFail'], 4000);
            this.hideLoading();
        });
    }

    private goProfile(): void {
        this.navCtrl.setRoot(TravelsProfilePage);
    }

    /**
     * @function ionViewDidLoad
     * @description Method used when the view is loaded
     */
    public ionViewDidLoad(): void {}
}
