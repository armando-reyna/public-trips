// Angular components
import { Component, ViewChild } from '@angular/core';

// Ionic components
import { App, NavController, NavParams, Slides } from 'ionic-angular';
import { NativeStorage } from 'ionic-native';

import * as _ from 'underscore';

// Helpers
import { ToastMessages } from '../../helpers/toast';
import { TravelsConstants } from '../../helpers/travels-constants';
import { LoadingMessages } from '../../helpers/loading';

// Pages
import { TravelsLoginPage } from '../travels-login';
import { TravelsListMovementsPage } from '../travels-list-movements';
import { TravelsCreateEventsPage } from '../travels-create-events';
import { TravelsExpensesTypePage } from '../travels-expenses-type';
import { TravelsApprovalsPage } from '../travels-approvals';
import { TravelsAdvancesPage } from '../travels-advances';

// Providers
import { TravelsService } from '../../providers/travels-service'
// Providers
import { AdvancesProvider } from '../../providers/advances'

@Component({
    selector: 'travels-home-page',
    templateUrl: './travels-home.html'
})

export class TravelsHomePage {

    /**
     * @property _loading
     * @description Model to show/hide the loading indicator
     */
    public _loading: boolean = false;

    /**
     * @property _messages
     * @description Used to store the travelsConstants messages.
     */
    private _messages: object = {};

    private _userData: object = {};
    private _userCards: Array<object> = [
        // {
        //     productDescription: 'desc',
        //     balance: 200,
        //     maskCardNumber: 1234,
        //     iut: 'B3121Y09N6CF'
        // },{
        //     productDescription: 'desc',
        //     balance: 200,
        //     maskCardNumber: 1234,
        //     iut: 'B3121Y09N6CF'
        // }
    ];
    private _currentCard: object;
    public _approvalsList: boolean = false;
    pendingAdvances: boolean;
    countEvents: number;
    countAdvances: number;
    @ViewChild(Slides) slides: Slides;

    /**
     * @constructor
     */
    constructor (
        private navCtrl: NavController,
        private toastMessages: ToastMessages,
        private travelsConstants: TravelsConstants,
        private loadingMessages: LoadingMessages,
        private travelsService: TravelsService,
        private advancesService: AdvancesProvider
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
     * @function showToastMessage
     * @description Method to show a toast message
     * @param {string} message [description]
     * @param {number} time    [description]
     */
    private showToastMessage(message: string, time: number): void {
        this.toastMessages.show(message);
        this.toastMessages.hide(time);
    }

    private logout(): void {
        this.travelsService.logout()
        .then(responseLogout => {
            this.navCtrl.setRoot(TravelsLoginPage);
        })
        .catch(errorLogout => {
            this.showToastMessage(this._messages['userLogoutFail'], 4000);
        });
    }

    public goToListMovements(card: Object): void {
        this.navCtrl.push(TravelsListMovementsPage, {cardData: card});
    }

    public goToCreateExpenses(): void {
        this.navCtrl.push(TravelsExpensesTypePage);
    }

    public goToCreateEvent(): void {
        this.navCtrl.push(TravelsCreateEventsPage);
    }

    private getBalance = (card) => {
        // this.showLoading(
        //     this._messages['userGetBalance']
        //     + ' de tarjeta **** '
        //     + card['maskCardNumber']
        // );

        this.travelsService.getBalance(card['iut'])
        .subscribe(responseBalance => {
            // this.hideLoading();
            card['movements'] = responseBalance['transactionMovementsDTOList'];
            card['balance'] = responseBalance['balance'];
        }, errorBalance => {
            card['movements'] = [];
            card['balance'] = null;
            this.showToastMessage(this._messages['userGetBalanceFail'] + card['maskCardNumber'], 3000);
            this.hideLoading();
        });
    }

    private getBalanceCards(): void {
        _.each(this._userCards, this.getBalance);
    }

    public getUserData(refresher?): void {
        NativeStorage.getItem('siValeId')
        .then(responseId => {

            this.travelsService.getUserInfo(responseId)
            .subscribe(responseInfo => {
                this._userData = responseInfo;
                this._userCards = this._userData['cards'] ? this._userData['cards'] : [];
                setTimeout(() => {this.slideChanged()}, 1000);
                this.getBalanceCards();
                NativeStorage.setItem('currentUser', JSON.stringify(responseInfo));
                if (refresher) { refresher.complete(); }
            }, errorInfo => {
                if (refresher) { refresher.complete(); }
            });
        })
        .catch(errorGet => {
            this.showToastMessage(this._messages['userSessionFail'], 5000);
            this.logout();
        });
    }

    private getApprovalsEvents = () => {
        this.travelsService.getApprovalsEvents()
        .subscribe( (responseApprovals: any) => {
            this._approvalsList = responseApprovals[0] ? true : false;
            if (this._approvalsList)
                this.countEvents = responseApprovals.length
        }, errorApprovals => {
            this._approvalsList = false;
            console.error('errorApprovals', errorApprovals);
        })
    }

    public goToApprovals = () => {
        this.navCtrl.push(TravelsApprovalsPage);
    }
    public goToAdvances() {
        this.navCtrl.push(TravelsAdvancesPage, {
            advances: this.countAdvances,
            events: this.countEvents
        });
    }

    /**
     * @function ionViewCanEnter
     * @description Method used before the view is loaded
     */
    public ionViewCanEnter(): void {}

    public ionViewWillEnter(): void {
        this.getUserData();
        this.getApprovalsEvents();
        this.advancesService.pending().subscribe((data:Array<Object>) => {
            if (data.length) {
                this.countAdvances = data.length;
                this.pendingAdvances = true;
            }
        })
    }
    slideChanged() {
        if (this._userCards.length && this.slides) {
            NativeStorage.setItem('selectedCard', this._userCards[this.slides.getActiveIndex()]).then(card => {
                this._currentCard = card;
            })
        } else {
            NativeStorage.remove('selectedCard');
        }
    }
}
