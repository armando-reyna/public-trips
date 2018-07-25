// Angular components
import { Component } from '@angular/core';

// Ionic components
import { NavController, NavParams } from 'ionic-angular';

import * as moment from 'moment';

// Helpers
import { ToastMessages } from '../../helpers/toast';
import { TravelsConstants } from '../../helpers/travels-constants';
import { LoadingMessages } from '../../helpers/loading';

// Pages
import { TravelsSelectExpensesPage } from '../travels-select-expenses';

@Component({
    selector: 'travels-transactions-detail-page',
    templateUrl: './travels-transactions-detail.html'
})

export class TravelsTransactionsDetailPage {

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
     * @property _currentTransaction
     * @description Used to store the event data
     */
    private _currentTransaction: Object = {};

    /**
     * @constructor
     */
    constructor (
        private navCtrl: NavController,
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

    public getLastCardNumbers(numberCard: string): string {
        numberCard = String(numberCard);

        return numberCard.length === 16
            ? numberCard.substring(12, numberCard.length)
            : '';
    }

    public goToExpenses(): void {
        this.navCtrl.push(TravelsSelectExpensesPage);
    }

    public ionViewDidLoad(): void {
        this._currentTransaction = this.navParams.get('transaction');
    }
}
