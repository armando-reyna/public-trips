// Angular components
import { Component } from '@angular/core';

// Ionic components
import { NavController } from 'ionic-angular';
import { NativeStorage } from 'ionic-native';

// Helpers
import { ToastMessages } from '../../helpers/toast';
import { TravelsConstants } from '../../helpers/travels-constants';
import { LoadingMessages } from '../../helpers/loading';

// Pages
import { TravelsLoginPage } from '../travels-login';
import { TravelsHomePage } from '../travels-home';
import { TravelsProfilePage } from '../travels-profile';
import { TravelsListEventsPage } from '../travels-list-events';
import { TravelsListExpensesPage } from '../travels-list-expenses';
import { TravelsListTransactionsPage } from '../travels-list-transactions';
import { TravelsInvoicesListPage} from '../travels-invoices-list';


// Providers
import { TravelsService } from '../../providers/travels-service'

@Component({
    selector: 'travels-tabs-page',
    templateUrl: './travels-tabs.html'
})

export class TravelsTabsPage {

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

    private _userData: Object = {};

    private _menuOptions: Array<Object> = [
        {
            page: TravelsListEventsPage,
            title: 'Informes',
            icon: 'paper'
        },
        {
            page: TravelsListExpensesPage,
            title: 'Gastos',
            icon: 'card'
        },
        {
            page: TravelsHomePage,
            title: 'Inicio',
            icon: 'home'
        },
        {
            page: TravelsListTransactionsPage,
            title: 'Transacciones',
            icon: 'link'
        },
        {
            page: TravelsInvoicesListPage,
            title: 'Facturas',
            icon: 'document'
        }
    ];

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
     * @function showToastMessage
     * @description Method to show a toast message
     * @param {string} message [description]
     * @param {number} time    [description]
     */
    private showToastMessage(message: string, time: number): void {
        this.toastMessages.show(message);
        this.toastMessages.hide(time);
    }

    public gotoProfile(): void {
        this.navCtrl.push(TravelsProfilePage);
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

    /**
     * @function ionViewDidLoad
     * @description Method used when the view is loaded
     */
    public ionViewDidLoad(): void {}

    /**
     * @function ionViewCanEnter
     * @description Method used before the view is loaded
     */
    public ionViewCanEnter(): void {
        NativeStorage.getItem('currentUser')
        .then(responseGet => {
            this._userData = JSON.parse(responseGet);
        })
        .catch(errorGet => {
            this.showToastMessage(this._messages['userSessionFail'], 5000);
            this.logout();
        });
    }
}
