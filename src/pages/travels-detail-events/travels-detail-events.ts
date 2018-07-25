// Angular components
import { Component } from '@angular/core';

// Ionic components
import { NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular';


import * as moment from 'moment';
import * as _ from 'underscore';

// Helpers
import { ToastMessages } from '../../helpers/toast';
import { TravelsConstants } from '../../helpers/travels-constants';
import { LoadingMessages } from '../../helpers/loading';

// Pages
import { TravelsSelectExpensesPage } from '../travels-select-expenses';
import { TravelsExpensesDetailPage } from '../travels-expenses-detail';
import { TravelsCreateEventsPage } from '../travels-create-events';


// Providers
import { TravelsService } from '../../providers/travels-service'

@Component({
    selector: 'travels-detail-events-page',
    templateUrl: './travels-detail-events.html'
})

export class TravelsDetailEventsPage {

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
     * @property _currentEvent
     * @description Used to store the event data
     */
    private _currentEvent: Object = {
        approvalStatus: { }
    };
    public _approval: boolean = false;

    public _currentExpenses: Array<Object> = [];

    public _totalAmount: number = 0;
    public _readyToApprove = false;


    /**
     * @constructor
     */
    constructor (
        private navCtrl: NavController,
        private navParams: NavParams,
        private toastMessages: ToastMessages,
        private travelsConstants: TravelsConstants,
        private loadingMessages: LoadingMessages,
        private travelsService: TravelsService,
        private modalCtrl: ModalController
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

    public getFormatDate(date): string {
        return moment(date).locale('es').format('DD MMM YYYY');
    }

    public addExpense(expense) {
        this._currentExpenses.push(expense);
        this.getExpensesTotalAmount();
        this.updateEvent();
    }

    public getExpensesTotalAmount(): void {
        this._totalAmount = 0;
        _.each(this._currentExpenses, (expense) => {
            this._totalAmount += Number(expense['spendingTotal'])
        });
    }

    public sendApprobal(): void {
        this.showLoading('Enviando a aprobación...');

        this._currentEvent['spendings'] = this._currentExpenses;
        this._currentEvent['approvalStatus'] = {
            id: 2
        };

        this.travelsService.updateEvent(this._currentEvent)
        .subscribe(responseUpdate => {
            this.hideLoading();
            this.showToastMessage(this._messages['sendApprobalOk'], 3000);
            this.navCtrl.pop();
        }, errorUpdate => {
            this.showToastMessage(this._messages['userServiceFail'], 2000);
            this.hideLoading();
        });
    }

    public approvalEvent(): void {
        this.showLoading('Enviando a aprobación...');

        this._currentEvent['spendings'] = this._currentExpenses;
        this._currentEvent['approvalStatus'] = {
            id: 3
        };

        // this.travelsService.updateEvent(this._currentEvent)
        this.travelsService.approveEvent(this._currentEvent['id'])
        .subscribe(responseUpdate => {
            this.hideLoading();
            this.showToastMessage(this._messages['sendApprobalOk'], 3000);
            this.navCtrl.pop();
        }, errorUpdate => {
            this.showToastMessage(this._messages['userServiceFail'], 2000);
            this.hideLoading();
        });
    }

    public rejectEvent(): void {
        this.showLoading('Enviando a aprobación...');
        this._currentEvent['spendings'] = this._currentExpenses;
        this.travelsService.rejectEvent(this._currentEvent['id'])
        .subscribe(responseUpdate => {
            this.hideLoading();
            this.showToastMessage(this._messages['sendApprobalOk'], 3000);
            this.navCtrl.pop();
        }, errorUpdate => {
            this.showToastMessage(this._messages['userServiceFail'], 2000);
            this.hideLoading();
        });
    }

    public updateEvent(): void {
        this.showLoading('Actualizando información');

        this._currentEvent['spendings'] = this._currentExpenses;
        this.travelsService.updateEvent(this._currentEvent)
        .subscribe(responseUpdate => {
            this.hideLoading();
        }, errorUpdate => {
            this.showToastMessage(this._messages['userServiceFail'], 2000);
            this.hideLoading();
        });
    }

    public goToExpenses(): void {
        let expensesModal = this.modalCtrl.create(TravelsSelectExpensesPage);
        expensesModal.onDidDismiss(expenseSelected => {
            if (expenseSelected) {
                !_.find(this._currentExpenses, (expense) => {
                    return expense['id'] === expenseSelected[0]['id'];
                })
                    ? this.addExpense(expenseSelected[0])
                    : this.showToastMessage(this._messages['expenseYetSelected'], 4000);
            }
        });
        expensesModal.present();
    }

    public setReadyToApprove() {
        this._readyToApprove = this._currentExpenses.length ? true : false;
    }

    public selectExpense(expense) {
        this.navCtrl.push(TravelsExpensesDetailPage, {
            expense: expense
        });
    }

    public ionViewDidEnter(): void {
        let event = this.navParams.get('event'),
        approval = this.navParams.get('approval');
        if (event) {
            if (event['name']) {
                this._currentEvent = event;
                console.log(this._currentEvent);
                this._currentExpenses = this._currentEvent['spendings'];
            }
            this.getExpensesTotalAmount();
        }
        if (approval) {
            this._approval = approval;
        }
    }
    editEvent() {
        this.navCtrl.push(TravelsCreateEventsPage, {
            event: this._currentEvent
        });
    }
}
