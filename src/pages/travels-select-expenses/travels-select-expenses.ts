// Angular components
import { Component } from '@angular/core';

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
    selector: 'travels-select-expenses-page',
    templateUrl: './travels-select-expenses.html'
})

export class TravelsSelectExpensesPage {

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

    private _expensesSelected: Array<Object> = [];


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
        this.showToastMessage(this._messages['userServiceFail'], 4000);
        this.hideLoading();
    }

    public getFormatDate(date): string {
        return moment(date).locale('es').format('DD MMM YYYY');
    }

    public closeSelectExpenses() {
        this.viewCtrl.dismiss();
    }

    public selectExpense(expense): void {
        console.log('seleccionado:', expense);

        this._expensesSelected.push(expense);
        console.log('enviando', this._expensesSelected);

        this.viewCtrl.dismiss(this._expensesSelected);
    }

    private getExpenses(): void {
        this.showLoading(this._messages['expensesLoading']);

        this.travelsService.getExpenses()
            .subscribe(responseExpenses => {
                this._currentExpenses = responseExpenses;
                this._currentExpenses = _.filter(this._currentExpenses, (expense) => !expense['event']);
                this._currentExpenses = _.sortBy(this._currentExpenses, 'dateStart').reverse();

                this.hideLoading();
            }, errorExpenses => {
                this.manageServiceFail();
            });
    }

    public ionViewWillEnter(): void {
        this.getExpenses();
    }
}
