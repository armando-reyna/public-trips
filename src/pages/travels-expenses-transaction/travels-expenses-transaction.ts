// Angular components
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

// Ionic components
import { App, NavController, NavParams, ViewController } from 'ionic-angular';
import { NativeStorage } from 'ionic-native';

import * as moment from 'moment';
import * as _ from 'underscore';

// Helpers
import { ToastMessages } from '../../helpers/toast';
import { TravelsConstants } from '../../helpers/travels-constants';
import { LoadingMessages } from '../../helpers/loading';

// Pages
import { TravelsExpensesCreatePage } from '../travels-expenses-create';

// Providers
import { TravelsService } from '../../providers/travels-service'

@Component({
    selector: 'travels-expenses-transaction-page',
    templateUrl: './travels-expenses-transaction.html'
})

export class TravelsExpensesTransactionPage {

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

    public _userData: Object = {};
    public _userCards: Array<Object> = [];
    private _transactions: Array<Object> = [];
    modalMode: boolean;

    public _params: {}

    /**
     * @constructor TravelsRecoveryPage
     */
    constructor (
        private viewCtrl: ViewController,
        private navCtrl: NavController,
        public navParams: NavParams,
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

    public getDateFormat(date): string {
        return moment(Number(date)).locale('es').format('DD MMM YYYY');
    }

    public addTransactions = (transaction) => this._transactions.push(transaction);

    public getTransactions = (card) => {
        this.showLoading('Obteniendo transacciones...');

        this.travelsService.getTransactions(card['iut'])
        .subscribe(responseTransactions => {
            this.hideLoading();
            _.each(responseTransactions, this.addTransactions);
        }, errorTransactions => {
            this.hideLoading();
            this.showToastMessage(this._messages['transactionsListFail'], 4000);
        });
    }

    private setEmptyParams(): void {
        this._params = { type: 'sivale' };
    }

    private setParams(transaction): void {
        this._params = { type: 'sivale', transaction: transaction };
    }

    public goToExpensesCreate(transaction?): void {
        transaction ? this.setParams(transaction) : this.setEmptyParams();
        console.log(this._params);
        if (this.modalMode)
            this.viewCtrl.dismiss(transaction);
        else
            this.navCtrl.push(TravelsExpensesCreatePage, this._params);
    }
    close() {
        this.viewCtrl.dismiss();
    }
    /**
     * @function ionViewDidLoad
     * @description Method used when the view is loaded
     */
    public ionViewDidLoad(): void {
        this.showLoading('Obteniendo información...');
        this.modalMode = this.navParams.get('modal');
        console.log('mode', this.modalMode);
        NativeStorage.getItem('currentUser')
        .then(responseGet => {
            this._userData = JSON.parse(responseGet);
            this._userCards = this._userData['cards'];
            this._transactions = [];
            this._userCards.length
                ? _.each(this._userCards, this.getTransactions)
                : this.hideLoading();
        })
        .catch(errorGet => {
            this.hideLoading();
            this.showToastMessage(this._messages['userSessionFail'], 5000);
        });
    }
}
