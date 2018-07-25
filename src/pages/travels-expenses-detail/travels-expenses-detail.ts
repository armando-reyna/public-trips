// Angular components
import { Component } from '@angular/core';

// Ionic components
import { NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';


import * as moment from 'moment';
import * as _ from 'underscore';

// Helpers
import { ToastMessages } from '../../helpers/toast';
import { TravelsConstants } from '../../helpers/travels-constants';
import { LoadingMessages } from '../../helpers/loading';

// Pages
import { TravelsSelectExpensesPage } from '../travels-select-expenses';
import { TravelsExpensesCreatePage } from '../travels-expenses-create';
import { TravelsInvoicesDetailPage } from '../travels-invoices-detail/travels-invoices-detail';
// Providers
import { TravelsService } from '../../providers/travels-service'

@Component({
    selector: 'travels-expenses-detail-page',
    templateUrl: './travels-expenses-detail.html'
})

export class TravelsExpensesDetailPage {
    public invoice = null;
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
     * @property _currentExpense
     * @description Used to store the event data
     */
    private _currentExpense: Object = {
        approvalStatus: {
            
        }
    };

    public _currentExpenses: Array<Object> = [];

    public _evidencePhoto: string = '';



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
        private modalCtrl: ModalController,
        private sanitizer:DomSanitizer
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

    // public goToExpenses(): void {
    //     this.navCtrl.push(TravelsSelectExpensesPage);
    // }

    public goToExpenses(): void {
        let expensesModal = this.modalCtrl.create(TravelsSelectExpensesPage);
        expensesModal.onDidDismiss(expenseSelected => {
            console.log(expenseSelected);
            !_.find(this._currentExpenses, (expense) => {
                return expense['id'] === expenseSelected[0]['id']
            }) ? this._currentExpenses.push(expenseSelected[0])
                : this.showToastMessage(this._messages['expenseYetSelected'], 4000);
            console.log(this._currentExpenses);
        });
        expensesModal.present();
    }

    public getEvidenceItem() {
        // this._evidencePhoto = 'data:image/jpeg;base64,' + this._currentExpense['ticket']['nameStorage'];
        this.showLoading('Cargando evidencias...');
        this.travelsService.getEvidenceItem(this._currentExpense['ticket']['id'])
        .subscribe(response => {
            this._evidencePhoto = response['file'];
            this.hideLoading();
        }, error => {
            this.hideLoading();
            this._evidencePhoto = '';
            this.showToastMessage('No fue posible cargar la evidencia, por favor intenta más tarde', 4000);
        })
    }

    public goToDetailEvent(invoice) {
        this.navCtrl.push(TravelsInvoicesDetailPage, {invoice: invoice});
    }

    public ionViewDidEnter(): void {
        let expense:Object = this.navParams.get('expense');
        if (expense) {
            this.showLoading('Cargando gasto...');
            this.travelsService.getExpenses(expense['id']).subscribe(data => {
                this.hideLoading();
                this._currentExpense = data;
                this._currentExpense['ticket']
                    ? this.getEvidenceItem()
                    : console.log(this._currentExpense);

                this._currentExpense['invoice']
                    ? this.invoice =  this._currentExpense['invoice']
                    : this.invoice;
            }, err => {
                this.hideLoading();
            })
        }
    }
    editExpense() {
        let params: Object = {
            expense: this._currentExpense
        }
        if (this._currentExpense['payMethod'].id === 1) {
            params['type'] = 'sivale';
        }
        if (this._currentExpense['transaction']) {
            params['transaction'] = this._currentExpense['transaction'];
        }
        if (this._evidencePhoto) {
            params['ticket'] = this._evidencePhoto;
        }
        this.navCtrl.push(TravelsExpensesCreatePage, params);
    }
}
