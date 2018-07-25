// Angular components
import { Component } from '@angular/core';

// Ionic components
import { NavController } from 'ionic-angular';
import { NativeStorage } from 'ionic-native';

import * as moment from 'moment';
import * as _ from 'underscore';

// Helpers
import { ToastMessages } from '../../helpers/toast';
import { TravelsConstants } from '../../helpers/travels-constants';
import { LoadingMessages } from '../../helpers/loading';

// Pages
import { TravelsLoginPage } from '../travels-login';
import { TravelsTransactionsDetailPage } from '../travels-transactions-detail';


// Providers
import { TravelsService } from '../../providers/travels-service'


@Component({
    selector: 'travels-list-transactions-page',
    templateUrl: './travels-list-transactions.html'
})

export class TravelsListTransactionsPage {
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

    public getDateFormat(date): string {
        return moment(Number(date)).locale('es').format('DD MMM YYYY');
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

    public goToTransactionsDetail(transaction): void {
        this.navCtrl.push(TravelsTransactionsDetailPage, { transaction: transaction });
    }

    /**
     * @function ionViewDidLoad
     * @description Method used when the view is loaded
     */
    public ionViewDidLoad(): void {}

    public ionViewWillEnter(): void {
        this.showLoading('Obteniendo información...');

        NativeStorage.getItem('currentUser')
        .then(responseGet => {
            this._userData = JSON.parse(responseGet);
            this._userCards = this._userData['cards'] ? this._userData['cards'] : [];
            this._transactions = [];
            this._userCards.length
                ? _.each(this._userCards, this.getTransactions)
                : this.hideLoading();
        })
        .catch(errorGet => {
            this.hideLoading();
            this.showToastMessage(this._messages['userSessionFail'], 5000);
            // this.logout();
        });
    }

    /**
     * @function ionViewCanEnter
     * @description Method used before the view is loaded
     */
    public ionViewCanEnter(): void {}
}
