// Angular components
import { Component } from '@angular/core';

// Ionic components
import { NavController } from 'ionic-angular';

import * as moment from 'moment';
import * as _ from 'underscore';

// Helpers
import { ToastMessages } from '../../helpers/toast';
import { TravelsConstants } from '../../helpers/travels-constants';
import { LoadingMessages } from '../../helpers/loading';

// Pages
import { TravelsExpensesTypePage } from '../travels-expenses-type';
import { TravelsExpensesDetailPage } from '../travels-expenses-detail';

// Providers
import { TravelsService } from '../../providers/travels-service'

@Component({
    selector: 'travels-list-expenses-page',
    templateUrl: './travels-list-expenses.html'
})

export class TravelsListExpensesPage {

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

    private _currentExpenses: any;

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

    /**
     * @function manageServiceFail
     * @description Method for show a toast message when the service fails
     */
    private manageServiceFail(): void {
        this.showToastMessage(this._messages['userServiceFail'], 4000);
        this.hideLoading();
    }

    public goToCreateExpenses(): void {
        this.navCtrl.push(TravelsExpensesTypePage);
    }

    private getExpenses(): void {
        this.showLoading(this._messages['expensesLoading']);

        this.travelsService.getExpenses()
        .subscribe(responseExpenses => {
            this._currentExpenses = responseExpenses;
            this._currentExpenses = _.sortBy(this._currentExpenses, 'dateStart').reverse();

            this.hideLoading();
        }, errorExpenses => {
            this.manageServiceFail();
        });
    }

    public getFormatDate(date): string {
        return moment(Number(date)).locale('es').format('DD MMM YYYY');
    }

    public goToExpensesDetail(expense): void {
        this.navCtrl.push(TravelsExpensesDetailPage, { expense: expense});
    }

    public deleteExpense(expense): void {
        this.showLoading(this._messages['expensesDeleteWait']);

        this.travelsService.deleteExpenses(expense.id)
        .subscribe(responseDelete => {
            this.hideLoading();
            this.showToastMessage(this._messages['expenseDeleteOk'], 3000);
            this.getExpenses();
        }, errorDelete => {
            this.hideLoading();
            this.showToastMessage(this._messages['expenseDeleteFail'], 3000);
        });
    }

    public ionViewDidLoad(): void {}

    public ionViewWillEnter(): void {
        this.getExpenses();
    }
}
