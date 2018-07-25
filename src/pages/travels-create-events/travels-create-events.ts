// Angular components
import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

// Ionic components
import { App, NavController, NavParams, Platform } from 'ionic-angular';
import { ModalController } from 'ionic-angular';

import * as moment from 'moment';
import * as _ from 'underscore';

import { DatePicker } from '@ionic-native/date-picker';

// Helpers
import { ToastMessages } from '../../helpers/toast';
import { TravelsConstants } from '../../helpers/travels-constants';
import { LoadingMessages } from '../../helpers/loading';

// Pages
import { TravelsSelectExpensesPage } from '../travels-select-expenses';


// Providers
import { TravelsService } from '../../providers/travels-service';

@Component({
    selector: 'travels-create-events-page',
    templateUrl: './travels-create-events.html'
})

export class TravelsCreateEventsPage {

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
    event: Object = {};
    /**
     * @property _formCreateGroup
     * @description Model for login form
     */
    public _formCreateGroup: FormGroup;

    public _minYear = moment().year() - 1;
    public _maxYear = moment().year() + 1;

    public _currentExpenses: Array<Object> = [];

    /**
     * @property _groupCreateSettings
     * @description Used to store the form validations and settings
     */
    private _groupCreateSettings: Object = {
        nameEvent: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        comment: ['']
    };

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
        private datePicker: DatePicker,
        public platform: Platform,
    ) {
        // Store the travels constants messages in component property
        this._messages = this.travelsConstants._messages;

        // Settings validations for create form
        this._formCreateGroup = this.formBuilder.group(this._groupCreateSettings);
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

    private manageServiceFail(): void {
        this.showToastMessage(this._messages['userServiceFail'], 4000);
        this.hideLoading();
    }

    private resetForm(): void {
        this._formCreateGroup.reset();
    }

    public getFormatDate(date): string {
        return moment(date).locale('es').format('DD MMM YYYY');
    }

    private validateDates(): boolean {
        const startDate = moment(this._formCreateGroup.controls['startDate'].value);
        const endDate = moment(this._formCreateGroup.controls['endDate'].value);

        return !endDate.isBefore(startDate);
    }

    private saveEvent(): void {
        if (!this._formCreateGroup.valid) {
            this.showToastMessage('Por favor complete la información.', 4000);
            return;
        }
        if(this.validateDates()) {
            this.showLoading('Guardando informe de gasto...');
            let form = this._formCreateGroup.value;
            this.event['dateStart'] = moment(form['startDate']).valueOf();
            this.event['dateEnd'] = moment(form['endDate']).valueOf();
            this.event['spendings'] = this._currentExpenses;
            
            console.log(form, this.event);

            if (this.event)
                form['id'] = this.event['id'];
            this.travelsService.saveEvent(this.event)
            .subscribe(responseSave => {
                this.resetForm();
                this.showToastMessage(this._messages['eventSaveOk'], 4000);
                this.hideLoading();
                this.navCtrl.popTo(this.navCtrl.getByIndex(0));
            }, errorSave => {
                this.manageServiceFail();
            });
        } else {
            this.showToastMessage(this._messages['endDateBeforeStartDate'], 4000);
        }
    }

    public goExpenses(): void {
        let expensesModal = this.modalCtrl.create(TravelsSelectExpensesPage);
        expensesModal.onDidDismiss(expenseSelected => {
            if (expenseSelected) {
                !_.find(this._currentExpenses, (expense) => {
                    return expense['id'] === expenseSelected[0]['id']
                })  ? this._currentExpenses.push(expenseSelected[0])
                    : this.showToastMessage(this._messages['expenseYetSelected'], 4000);
            }
        });
        expensesModal.present();
    }
    public deleteExpense(expenseIndex) {
        this._currentExpenses.splice(expenseIndex, 1);
        
    }

    public ionViewDidEnter(): void {
        let event = this.navParams.get('event');
        if (event) {
            event['dateEnd'] = moment(Number.parseInt(event['dateEnd'])).format("YYYY-MM-DD");
            event['dateStart'] = moment(Number.parseInt(event['dateStart'])).format("YYYY-MM-DD");
            let spendings = [];
            for (let spend of event['spendings']) {
                spendings.push(spend);
            }
            this._currentExpenses = spendings;
            this.event = event;
        }
        console.log(this.event);
    }
    openDatePicker(mode) {
        let settings: any = {
            date: new Date(),
            mode: 'date',
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
        },
        minDate = moment().subtract(1, 'year'),
        maxDate = moment().add(1, 'year');

        if (mode === 'end') {
            settings['minDate'] = this.event['dateStart'] ? moment(this.event['dateStart']) : minDate;
            settings['maxDate'] = maxDate;
            if (this.event['dateEnd'])
                settings['date'] = moment(this.event['dateEnd']).toDate();
        } else {
            settings['minDate'] = minDate;
            settings['maxDate'] = this.event['dateEnd'] ? moment(this.event['dateEnd']) : maxDate;
            if (this.event['dateStart'])
                settings['date'] = moment(this.event['dateStart']).toDate();
        }
        if(this.platform.is('android')) {
            settings['minDate'] = settings['minDate'].valueOf();
            settings['maxDate'] = settings['maxDate'].valueOf();
        } else {
            settings['minDate'] = settings['minDate'].toDate();
            settings['maxDate'] = settings['maxDate'].toDate();
        }
        console.log(settings);
        this.datePicker.show(settings).then(
            (date: any) => { 
                date = moment(date).format("YYYY-MM-DD")
                if (mode === 'end')
                    this.event['dateEnd'] = date;
                else
                    this.event['dateStart'] = date;
            },
            err => console.error('Error occurred while getting date: ', err)
        );
    }
}
