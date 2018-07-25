// Angular components
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

// Ionic components
import { ViewController } from 'ionic-angular';

import * as moment from 'moment';
import * as _ from 'underscore';

// Helpers
import { ToastMessages } from '../../helpers/toast';
import { TravelsConstants } from '../../helpers/travels-constants';
import { LoadingMessages } from '../../helpers/loading';

// Providers
import { TravelsService } from '../../providers/travels-service'

@Component({
    selector: 'travels-invoices-select-page',
    templateUrl: './travels-invoices-select.html'
})

export class TravelsInvoicesSelectPage {

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

    private _currentInvoices: any;

    private _invoiceSelected: Array<Object> = [];


    /**
     * @constructor
     */
    constructor (
        private toastMessages: ToastMessages,
        private travelsConstants: TravelsConstants,
        private loadingMessages: LoadingMessages,
        private travelsService: TravelsService,
        private viewCtrl: ViewController
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

    /**
     * @function manageServiceFail
     * @description Method for show a toast message when the service fails
     */
    private manageServiceFail(): void {
        this.showToastMessage(this._messages['invoicesFail'], 4000);
        this.hideLoading();
    }

    public getFormatDate(date): string {
        return moment(date).locale('es').format('DD MMM YYYY');
    }

    public closeSelectInvoices() {
        this.viewCtrl.dismiss();
    }

    public selectInvoice(invoice): void {
        this.viewCtrl.dismiss(invoice);
    }

    private getInvoices(): void {
        this.showLoading(this._messages['invoicesLoading']);

        this.travelsService.getInvoices()
            .subscribe(responseInvoices => {
                this._currentInvoices = responseInvoices;
                this._currentInvoices = _.filter(this._currentInvoices, (invoice) => !invoice['spendings']);
                // this._currentInvoices = _.sortBy(this._currentInvoices, 'dateStart').reverse();

                this.hideLoading();
            }, errorInvoices => {
                this.manageServiceFail();
            });
    }

    public ionViewWillEnter(): void {
        this.getInvoices();
    }
}
