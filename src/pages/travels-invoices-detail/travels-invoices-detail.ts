// Angular components
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

// Ionic components
import { App, NavController, NavParams } from 'ionic-angular';


import * as moment from 'moment';
import * as _ from 'underscore';

// Helpers
import { ToastMessages } from '../../helpers/toast';
import { TravelsConstants } from '../../helpers/travels-constants';
import { LoadingMessages } from '../../helpers/loading';

// Providers
import { TravelsService } from '../../providers/travels-service'

@Component({
    selector: 'travels-invoices-detail-page',
    templateUrl: './travels-invoices-detail.html'
})

export class TravelsInvoicesDetailPage {

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
     * @property _currentInvoice
     * @description Used to store the event data
     */
    private _currentInvoice: Object = {};


    /**
     * @constructor
     */
    constructor (
        private navParams: NavParams,
        private toastMessages: ToastMessages,
        private travelsConstants: TravelsConstants,
        private loadingMessages: LoadingMessages
    ) {
        // Store the travels constants messages in component property
        this._messages = this.travelsConstants._messages;
    }

    public getDateFormat(date): string {
        return moment(Number(date)).locale('es').format('DD MMM YYYY');
    }

    public getFormatDate(date): string {
        return moment(date).locale('es').format('DD MMM YYYY');
    }

    public ionViewDidLoad(): void {
        this._currentInvoice = this.navParams.get('invoice');
    }
}
