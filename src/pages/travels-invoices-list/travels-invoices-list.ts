// Angular components
import { Component } from '@angular/core';

// Ionic components
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

// Helpers
import { ToastMessages } from '../../helpers/toast';
import { TravelsConstants } from '../../helpers/travels-constants';
import { LoadingMessages } from '../../helpers/loading';

// Pages
import { TravelsInvoicesDetailPage } from '../travels-invoices-detail/travels-invoices-detail';

// Providers
import { TravelsService } from '../../providers/travels-service'

@Component({
    selector: 'travels-invoices-list-page',
    templateUrl: './travels-invoices-list.html'
})

export class TravelsInvoicesListPage {

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

    public _currentInvoices: any;

    /**
     * @constructor
     */
    constructor (
        private navCtrl: NavController,
        private toastMessages: ToastMessages,
        private travelsConstants: TravelsConstants,
        private loadingMessages: LoadingMessages,
        private travelsService: TravelsService,
        private alertController: AlertController
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
     * @function manageServiceFail
     * @description Method for show a toast message when the service fails
     */
    private manageServiceFail(): void {
        this.showToastMessage(this._messages['userServiceFail'], 4000);
        this.hideLoading();
    }

    public deleteAlert(slidingItem: any) {
        let alert = this.alertController.create({
            title: 'Eliminar Factura',
            subTitle: '¿Seguro que deseas eliminar?',
            buttons: [
                {
                    text: 'CANCELAR.',
                    role: 'cancel',
                    handler: () => {
                        slidingItem.close();
                    }
                },{
                    text: 'ACEPTAR',
                    handler: () => {

                        slidingItem.close();
                    }
                }
            ]
        });
        alert.present();
    }

    public deleteInvoice(invoice: any, slidingItem: any) {
        this.deleteAlert(slidingItem);
    }

    public goToDetailEvent(invoice: any) {
        this.navCtrl.push(TravelsInvoicesDetailPage, {invoice: invoice});
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

    public getInvoices(refresher?): void {
        if (!refresher) { this.showLoading(''); }

        this.travelsService.getInvoices()
        .subscribe(responseInvoices => {
            this._currentInvoices = responseInvoices;
            // this._currentEvents = _.sortBy(this._currentEvents, 'dateStart').reverse();
            if (refresher) {
                refresher.complete();
            } else {
                this.hideLoading();
            }
        }, errorInvoices => {
            this.manageServiceFail();
        });
    }

    public ionViewWillEnter(): void {
        this.getInvoices();
    }
}
