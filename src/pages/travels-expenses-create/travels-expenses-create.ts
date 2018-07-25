// Angular components
import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, Platform } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Keyboard } from '@ionic-native/keyboard';


// Ionic components
import { NavController, NavParams } from 'ionic-angular';
import { Camera, Transfer, File, FilePath, FileEntry } from 'ionic-native';
import { DatePicker } from '@ionic-native/date-picker';

import * as moment from 'moment';
import * as _ from 'underscore';

// Helpers
import { ToastMessages } from '../../helpers/toast';
import { TravelsConstants } from '../../helpers/travels-constants';
import { LoadingMessages } from '../../helpers/loading';

// Pages
import { TravelsSelectExpensesPage } from '../travels-select-expenses';
import { TravelsInvoicesSelectPage } from '../travels-invoices-select';
import { TravelsExpensesTransactionPage } from '../travels-expenses-transaction';


// Providers
import { TravelsService } from '../../providers/travels-service';

declare var window: any;

@Component({
    selector: 'travels-expenses-create-page',
    templateUrl: './travels-expenses-create.html',
    providers:[Camera, Transfer, File, FilePath]
})

export class TravelsExpensesCreatePage {

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
    expense: Object = {
        payMethod: { }
    };

    /**
     * @property _formCreateGroup
     * @description Model for login form
     */
    public _formCreateGroup: FormGroup;

    /**
     * @property _groupCreateSettings
     * @description Used to store the form validations and settings
     */
    private _groupCreateSettings: Object = {
        nameExpense: ['', Validators.required],
        payMethod: [''],
        payDate: ['', Validators.required],
        typeExpense: [''],
        amountExpense: ['']
    };

    public _currentParams = {
        type: '',
        transaction: {}
    };

    public _expensesTypes: any;
    public _payMethods: any;
    public _expensesItems: Array<Object> = [];
    public _totalAmount: number = 0;

    public _minYear = moment().year() - 1;
    public _maxYear = moment().year() + 1;

    public _cameraOptions: Object = {};
    public _evidences = null;
    public _currentEvidence: string = '';
    private _currentSessionToken: string = '';
    private _formPicture: any;
    public _currentPhoto: string = '';
    public _invoiceSelected: any;
    spendingTypeAmount: number;

    date;
    /**
     * @constructor
     */
    constructor (
        private navCtrl: NavController,
        private navParams: NavParams,
        private toastMessages: ToastMessages,
        private travelsConstants: TravelsConstants,
        private formBuilder: FormBuilder,
        private loadingMessages: LoadingMessages,
        private travelsService: TravelsService,
        private modalCtrl: ModalController,
        private sanitizer:DomSanitizer,
        private datePicker: DatePicker,
        public platform: Platform,
        private keyboard: Keyboard
    ) {
        // Store the travels constants messages in component property
        this._messages = this.travelsConstants._messages;

        // Settings validations for create form
        this._formCreateGroup = this.formBuilder.group(this._groupCreateSettings);

        // Settings for camera options
        this._cameraOptions = {
            quality: 20,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            correctOrientation: true
        };
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

    private manageServiceFail(error?): void {
        if (error) {
            error = error.json();
            this.showToastMessage(error.message, 4000);
        } else {
            this.showToastMessage(this._messages['userServiceFail'], 4000);
        }
        this.hideLoading();
    }

    private resetForm(): void {
        this._formCreateGroup.reset();
    }

    private getDataPayMethodId() {
        return { id: (this._currentParams.type === 'sivale' ? 1 : this._formCreateGroup.controls['payMethod'].value) };
    }

    private getDataPayMethodName(payMethod): string {
        return _.find(this._payMethods, (type) => { return type['id'] === payMethod['id']})['name'];
    }

    private getDataDateFormat() {
        return this._currentParams.transaction['fecha']
            ? moment(this._currentParams.transaction['fecha'], 'DD/MM/YYYY').valueOf()
            : moment(this._formCreateGroup.controls['payDate'].value, 'YYYY/MM/DD').valueOf();
    }

    private transformItems = (item) => {
        return {
            amount: item['amount'],
            spendingType: { id: item['type']['id'] }
        }
    }

    private getDataExpensesItems() {
        return _.map(this._expensesItems, this.transformItems);
    }

    private getDataTransaction() {
        return this._currentParams.transaction['numAutorizacion']
            ? this._currentParams.transaction
            : null;
    }

    private getEvidenceId() {
        return this._evidences ? this._evidences : null;
    }
    amountChange(e) {
        var code = e.keyCode || e.which;
		if (code === 13) {
            this.keyboard.close();
		}
    }
    private getExpensesData(): Object {
        this.expense['payMethod'] = this.getDataPayMethodId();
        if (this._currentParams['type'] !== 'sivale') {
            this.expense['dateStart'] = String(this.getDataDateFormat());
            this.expense['dateFinished'] = String(this.getDataDateFormat());
        }
        this.expense['invoice'] = this._invoiceSelected;
        this.expense['ticket'] = this.getEvidenceId();
        this.expense['spendings'] = this.getDataExpensesItems();
        this.expense['spendingTotal'] = this.calculateTotalAmount();
        this.expense['transaction'] = this.getDataTransaction();
        return this.expense;
    }

    private saveExpenses(): void {
        if (!this._formCreateGroup.valid) {
            this.showToastMessage('Por favor complete la información.', 4000);
            return;
        }
        this.showLoading('Guardando gasto...');

        if(this._formPicture) {

            this.travelsService.uploadEvidence(this._formPicture, this._currentSessionToken)
            .subscribe(responseUpload => {
                this._evidences = { id: responseUpload['evidenceId'] };
                this.travelsService.saveExpense(this.getExpensesData())
                .subscribe(responseSave => {
                    this.resetForm();
                    this.showToastMessage(this._messages['expensesSaveOk'], 3000);
                    this.hideLoading();
                    this.navCtrl.popTo( this.navCtrl.getByIndex(0));
                }, errorSave => {
                    this.manageServiceFail(errorSave);
                });
            }, errorUpload => {
                this.manageServiceFail(errorUpload);
            });
        } else {
            this.travelsService.saveExpense(this.getExpensesData())
            .subscribe(responseSave => {
                this.resetForm();
                this.showToastMessage(this._messages['expensesSaveOk'], 3000);
                this.hideLoading();
                this.navCtrl.popTo( this.navCtrl.getByIndex(0));
            }, errorSave => {
                this.manageServiceFail(errorSave);
            });
        }
    }

    public goExpenses(): void {
        this.navCtrl.push(TravelsSelectExpensesPage);
    }

    public getItemType(typeId): Object {
        return _.find(this._expensesTypes, (type) => { return type['id'] === typeId});
    }
    private getExpencesTotalAmount(amount) {
        let total = amount;
        for (let expense of this._expensesItems) {
            total += expense['amount'];
        }
        return total;
    }
    private pushExpensesItem(amount, type): void {
        let total = this.getExpencesTotalAmount(amount);
        if (this._currentParams['transaction']['consumoNeto']) {
            if (total > this._currentParams['transaction']['consumoNeto']) {
                this.showToastMessage(this._messages['spendingAmountExceeded'], 3000);
                return;
            }
        }
        if (this._invoiceSelected) {
            if (total > Number(this._invoiceSelected['total'])) {
                this.showToastMessage(this._messages['spendingAmountExceededInvoice'], 3000);
                return;
            }
        }
        this._expensesItems.push({ amount: amount, type: type });
        this._formCreateGroup.controls['amountExpense'].setValue('');
        this._formCreateGroup.controls['typeExpense'].setValue('');
    }

    public addExpensesItem(): void {
        const amount = this._formCreateGroup.controls['amountExpense'].value.replace('$', '').replace(new RegExp(',', 'g'), '');
        const type = this.getItemType(this._formCreateGroup.controls['typeExpense'].value);

        !isNaN(amount) && amount && amount > 0 && type
            ? this.pushExpensesItem(Number(amount), type)
            : this.showToastMessage(this._messages['typeDataFail'], 3000);
    }

    addTransaction() {
        let transactionModal = this.modalCtrl.create(TravelsExpensesTransactionPage, {
            modal: true
        });
        transactionModal.onDidDismiss(transaction => {
            if (transaction)
                this._currentParams['transaction'] = transaction;
        });
        transactionModal.present();
    }
    deleteTransaction() {
        this._currentParams['transaction'] = {};
    }

    public calculateTotalAmount(): number {
        this._totalAmount = 0;
        _.each(this._expensesItems, (item) => { this._totalAmount += item['amount']});
        // this._totalAmount = parseFloat(Math.round(this._totalAmount * 100) / 100).toFixed(2);
        return this._totalAmount;
    }

    public deleteExpensesItem(index): void {
        this._expensesItems.splice(index, 1);
    }

    public setCurrentParams(): void {
        this._currentParams = {
            type: this.navParams.get('type'),
            transaction: this.navParams.get('transaction') ? this.navParams.get('transaction') : {}
        };
        console.log(this._currentParams);
    }

    public readFile(file) {
        this.showLoading(this._messages['cameraLoading']);

        const reader = new FileReader();
        reader.onloadend = () => {
            const formData = new FormData();
            let imgBlob = new Blob([reader.result], { type: 'image/jpeg' });
            imgBlob['name'] = file.name;
            formData.append('file', imgBlob, file.name);
            this._formPicture = formData;
            this.hideLoading();
        };
        reader.readAsArrayBuffer(file);
    }


    public getPicture() {
        return Camera.getPicture(this._cameraOptions)
        .then(responsePicture => {
            this._currentPhoto = responsePicture;
            console.log('responsePicture', responsePicture);
            window.resolveLocalFileSystemURL(responsePicture, (fileEntry) => {
                fileEntry.file(responseFile => { this.readFile(responseFile) });
            })
        })
        .catch(error => {
            console.error(error);
            this.showToastMessage(this._messages['cameraFail'], 4000);
        });
    }

    public getInvoice() {
        // this.navCtrl.push(TravelsListInvoicesPage);
        let invoicesModal = this.modalCtrl.create(TravelsInvoicesSelectPage);
        invoicesModal.onDidDismiss(invoiceSelected => {
            if (invoiceSelected) {
                if (this._currentParams['transaction']['consumoNeto']) {
                    if (Number(invoiceSelected['total']) > this._currentParams['transaction']['consumoNeto']) {
                        this.showToastMessage(this._messages['invoiceAmountExceeded'], 3000);
                        return;
                    }
                }
                if (this.getExpencesTotalAmount(0) > Number(invoiceSelected['total'])) {
                    this.showToastMessage(this._messages['invoiceAmountExceededSpending'], 3000);
                    return;
                }
                this._invoiceSelected = invoiceSelected;
            }
        });
        invoicesModal.present();
    }
    openDatePicker() {
        let settings: any = {
            date: new Date(),
            mode: 'date',
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
        };
        settings['minDate'] = moment().subtract(1, 'year');
        settings['maxDate'] = moment().add(1, 'year');
        if(this.platform.is('android')) {
            settings['minDate'] = settings['minDate'].valueOf();
            settings['maxDate'] = settings['maxDate'].valueOf();
        } else {
            settings['minDate'] = settings['minDate'].toDate();
            settings['maxDate'] = settings['maxDate'].toDate();
        }
        this.datePicker.show(settings).then(
            (date: any) => {
                this.date = moment(date).format("YYYY-MM-DD");
            },
            err => console.error('Error occurred while getting date: ', err)
        );
    }
    
    public ionViewWillEnter(): void {
        this.showLoading('Onteniendo tipos de gasto...');
        this.travelsService.getExpensesType()
        .subscribe(responseTypes => {
            this.hideLoading();
            this.showLoading('Onteniendo métodos de pago...');
            this._expensesTypes = responseTypes;
            this.travelsService.getPayMethod()
            .subscribe((responsePayMethod: Array<Object>) => { 
                this.hideLoading(); 
                let methods = []; 
                for (let method of responsePayMethod) { 
                    if(method['id'] !== 1 || this._currentParams['transaction']['consumoNeto']) { 
                        methods.push(method); 
                    } 
                } 
                this._payMethods = methods;
            }, errorPayMethod => {
                this.hideLoading();
                this.showToastMessage(this._messages['expensesPayMethodFail'], 4000);
            });
        }, errorTypes => {
            this.hideLoading();
            this.showToastMessage(this._messages['expensesTypesFail'], 4000);
        });
        let expense = this.navParams.get('expense');
        let ticket = this.navParams.get('ticket');

        if (ticket) {
            this._currentPhoto = ticket;
        }
        if (expense) {
            this.date = moment(Number.parseInt(expense['dateStart'])).format("YYYY-MM-DD");;
            if (expense['payMethod']['id'] === 1)
                this._currentParams['type'] = 'sivale';

            if (expense['transaction'])
                this._currentParams['transaction'] = expense['transaction'];

            if (expense['ticket'])
                this._evidences = expense['ticket'];
            
            if (expense['invoice'])
                this._invoiceSelected = expense['invoice'];

            let spends = [];
            for (let spend of expense['spendings']) {
                spends.push({
                    type: {
                        name: spend['spendingType']['name'],
                        id: spend['spendingType']['id']
                    },
                    amount: Number(spend['amount'])
                })
            }
            this._expensesItems = spends;
            this.expense = expense;
        } else {
            this.date = moment().format("YYYY-MM-DD");
            this.setCurrentParams();
        }
    }
}
