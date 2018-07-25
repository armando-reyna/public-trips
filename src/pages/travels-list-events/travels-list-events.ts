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
import { TravelsCreateEventsPage } from '../travels-create-events';
import { TravelsDetailEventsPage } from '../travels-detail-events';

// Providers
import { TravelsService } from '../../providers/travels-service'

@Component({
    selector: 'travels-list-events-page',
    templateUrl: './travels-list-events.html'
})

export class TravelsListEventsPage {

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

    private _currentEvents: any;

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

    public goToCreateEvents(): void {
        this.navCtrl.push(TravelsCreateEventsPage);
    }

    public goToDetailEvent(event): void {
        this.navCtrl.push(TravelsDetailEventsPage, { event: event });
    }

    /**
     * @function manageServiceFail
     * @description Method for show a toast message when the service fails
     */
    private manageServiceFail(): void {
        this.showToastMessage(this._messages['userServiceFail'], 4000);
        this.hideLoading();
    }

    private getEvents(refresher?): void {
        this.showLoading(this._messages['eventsLoading']);

        this.travelsService.getEvents()
        .subscribe(responseEvents => {
            this._currentEvents = responseEvents;
            this._currentEvents = _.sortBy(this._currentEvents, 'dateStart').reverse();
            if (refresher) {
                refresher.complete();
            }
            this.hideLoading();
        }, errorEvents => {
            this.manageServiceFail();
        });
    }

    public getDateFormat(date): string {
        return moment(Number(date)).locale('es').format('DD MMM YYYY');
    }

    public deleteEvent(item): void {
        this.travelsService.deleteEvent(item['id'])
        .subscribe(responseDelete => {
            this.showToastMessage(this._messages['eventsDeleteOk'], 3000);
            this.getEvents();
        }, errorDelete => {
            this.manageServiceFail();
        });
    }

    public getTotalAmount(spendings) {
        let _currentTotalAmount = 0;
        _.each(spendings, (expense) => {
            _currentTotalAmount += Number(expense['spendingTotal']);
        });
        return _currentTotalAmount;
    }

    public ionViewDidLoad(): void {}

    public ionViewWillEnter(): void {
        this.getEvents();
    }
}
