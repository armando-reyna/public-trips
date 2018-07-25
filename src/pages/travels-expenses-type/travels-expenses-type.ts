// Angular components
import { Component } from '@angular/core';

// Ionic components
import { App, NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from 'ionic-native';

// Helpers
import { ToastMessages } from '../../helpers/toast';
import { TravelsConstants } from '../../helpers/travels-constants';
import { LoadingMessages } from '../../helpers/loading';

// Pages
import { TravelsExpensesTransactionPage } from '../travels-expenses-transaction';
import { TravelsExpensesCreatePage } from '../travels-expenses-create';

@Component({
    selector: 'travels-expenses-type-page',
    templateUrl: './travels-expenses-type.html'
})

export class TravelsExpensesTypePage {

    /**
     * @property _loading
     * @description Model to show/hide the loading indicator
     */
    public _loading: boolean = false;

    cardAvailable: boolean = false;
    
    /**
     * @property _messages
     * @description Used to store the travelsConstants messages.
     */
    private _messages: Object = {};

    /**
     * @constructor TravelsRecoveryPage
     */
    constructor (
        private navCtrl: NavController,
        private toastMessages: ToastMessages,
        private travelsConstants: TravelsConstants,
        private loadingMessages: LoadingMessages
    ) {
        // Store the travels constants messages in component property
        this._messages = this.travelsConstants._messages;
    }

    public goToExpensesTransaction(): void {
        this.navCtrl.push(TravelsExpensesTransactionPage, { type: 'sivale' });
    }

    public goToExpensesCreate(): void {
        this.navCtrl.push(TravelsExpensesCreatePage, { type: 'other' });
    }

    /**
     * @function ionViewDidLoad
     * @description Method used when the view is loaded
     */
    public ionViewDidLoad(): void {}
    ionViewWillEnter() {
        NativeStorage.getItem('selectedCard').then(card => {
        if (card)
            this.cardAvailable = true;
        });
    }
}
