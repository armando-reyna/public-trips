// Angular components
import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

// Ionic components
import { App, NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from 'ionic-native';

// Helpers
import { ToastMessages } from '../../helpers/toast';
import { TravelsConstants } from '../../helpers/travels-constants';
import { LoadingMessages } from '../../helpers/loading';

// Libraries
import moment from 'moment';
import 'moment/locale/es'
moment.locale('es')

// Providers
import { TravelsService } from '../../providers/travels-service'

@Component({
    selector: 'travels-list-movements-page',
    templateUrl: './travels-list-movements.html'
})

export class TravelsListMovementsPage {

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

    private _cardData: Object = {};

    movements: Object;
    objectKeys = Object.keys;
    /**
     * @constructor
     */
    constructor (
        private app: App,
        private navCtrl: NavController,
        private navParams: NavParams,
        private toastMessages: ToastMessages,
        private travelsConstants: TravelsConstants,
        private formBuilder: FormBuilder,
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

    private getCardParams(): void {
        this._cardData = this.navParams.get('cardData');
    }

    public ionViewDidLoad(): void {
        this.getCardParams();
        this.showLoading('Cargando movimientos');
        this.travelsService.getMovements(this._cardData['iut']).subscribe((data : Array<Object>) => {
            // data = [
            //     {
            //         "authorizationNumber": "585578",
            //         "numberCard": "4600",
            //         "transactionDate": "20180611 195611",
            //         "amount": -423.12,
            //         "acceptorName": "NURIA CASTRO SEBELON 1MADRID          ES",
            //         "transactionType": "cargo"
            //     },
            //     {
            //         "authorizationNumber": "364092",
            //         "numberCard": "4600",
            //         "transactionDate": "20180611 15442",
            //         "amount": -133.36,
            //         "acceptorName": "PAPIZZA               MADRID          ES",
            //         "transactionType": "cargo"
            //     },
            //     {
            //         "authorizationNumber": "358792",
            //         "numberCard": "4600",
            //         "transactionDate": "20180611 14407",
            //         "amount": -601.31,
            //         "acceptorName": "TXAPELA MADRID        MADRID          ES",
            //         "transactionType": "cargo"
            //     },
            //     {
            //         "authorizationNumber": "566251",
            //         "numberCard": "4600",
            //         "transactionDate": "20180611 134531",
            //         "amount": -727.42,
            //         "acceptorName": "TERESA COCA REBOLLERO-MADRID          ES",
            //         "transactionType": "cargo"
            //     },
            //     {
            //         "authorizationNumber": "566110",
            //         "numberCard": "4600",
            //         "transactionDate": "20180611 130923",
            //         "amount": -278.84,
            //         "acceptorName": "HOTEL MADRID PLAZA ESPMADRID          ES",
            //         "transactionType": "cargo"
            //     },
            //     {
            //         "authorizationNumber": "046090",
            //         "numberCard": "4600",
            //         "transactionDate": "20180610 24900",
            //         "amount": -969.9,
            //         "acceptorName": "CAFE TABERNA SAN BRUNOMADRID          ES",
            //         "transactionType": "cargo"
            //     },
            //     {
            //         "authorizationNumber": "291218",
            //         "numberCard": "4600",
            //         "transactionDate": "20180609 85849",
            //         "amount": -2.31,
            //         "acceptorName": "PAUL 2F1 025526 Intl.",
            //         "transactionType": "cargo"
            //     },
            //     {
            //         "authorizationNumber": "705536",
            //         "numberCard": "4600",
            //         "transactionDate": "20180609 34537",
            //         "amount": -913.41,
            //         "acceptorName": "LA BARRACA RESTAURANTEMADRID          ES",
            //         "transactionType": "cargo"
            //     },
            //     {
            //         "authorizationNumber": "406462",
            //         "numberCard": "4600",
            //         "transactionDate": "20180608 50350",
            //         "amount": -398.56,
            //         "acceptorName": "DE MARIA GRAN VIA     MADRID          ES",
            //         "transactionType": "cargo"
            //     },
            //     {
            //         "authorizationNumber": "394991",
            //         "numberCard": "4600",
            //         "transactionDate": "20180608 42840",
            //         "amount": -726.85,
            //         "acceptorName": "TAXI Nc LICENCIA 14-31MADRID          ES",
            //         "transactionType": "cargo"
            //     },
            //     {
            //         "authorizationNumber": "557618",
            //         "numberCard": "4600",
            //         "transactionDate": "20180608 203350",
            //         "amount": -1290.16,
            //         "acceptorName": "BIENMESABE            MADRID          ES",
            //         "transactionType": "cargo"
            //     },
            //     {
            //         "authorizationNumber": "291218",
            //         "numberCard": "4600",
            //         "transactionDate": "20180607 224752",
            //         "amount": -208.48,
            //         "acceptorName": "PAUL 2F1 025526       ROISSY CDG CE   FR",
            //         "transactionType": "cargo"
            //     },
            //     {
            //         "authorizationNumber": "758305",
            //         "numberCard": "4600",
            //         "transactionDate": "20180605 134408",
            //         "amount": -3276,
            //         "acceptorName": "FPROHIBIDOS COPENAGE  CIUDAD DE MEX00 MX",
            //         "transactionType": "cargo"
            //     },
            //     {
            //         "authorizationNumber": "324146",
            //         "numberCard": "4600",
            //         "transactionDate": "20180529 221033",
            //         "amount": -7058.5,
            //         "acceptorName": "LA MANSION            MEXICO DF    DF MX",
            //         "transactionType": "cargo"
            //     },
            //     {
            //         "authorizationNumber": "953426",
            //         "numberCard": "4600",
            //         "transactionDate": "20180528 162916",
            //         "amount": -1324,
            //         "acceptorName": "RINCON ARGENTINO      MEXICO DF    000MX",
            //         "transactionType": "cargo"
            //     },
            //     {
            //         "authorizationNumber": "543081",
            //         "numberCard": "4600",
            //         "transactionDate": "20180516 181122",
            //         "amount": -1389,
            //         "acceptorName": "REST LOMA LINDA       MEXICO DF    001MX",
            //         "transactionType": "cargo"
            //     },
            //     {
            //         "authorizationNumber": "079666",
            //         "numberCard": "4600",
            //         "transactionDate": "20180502 153544",
            //         "amount": -2295,
            //         "acceptorName": "LA MANSION            MEXICO DF    DF MX",
            //         "transactionType": "cargo"
            //     },
            //     {
            //         "authorizationNumber": "827901",
            //         "numberCard": "4600",
            //         "transactionDate": "20180426 155455",
            //         "amount": -230,
            //         "acceptorName": "TRANSP TERRESTRE NVA IMEXICO DF    DF MX",
            //         "transactionType": "cargo"
            //     },
            //     {
            //         "authorizationNumber": "693224",
            //         "numberCard": "4600",
            //         "transactionDate": "20180425 220615",
            //         "amount": -654,
            //         "acceptorName": "CHILIS TORRES         SN PEDRO GARZ019MX",
            //         "transactionType": "cargo"
            //     },
            //     {
            //         "authorizationNumber": "595450",
            //         "numberCard": "4600",
            //         "transactionDate": "20180425 153007",
            //         "amount": -543.95,
            //         "acceptorName": "REST LOS FRESNOS      APODACA NL   019MX",
            //         "transactionType": "cargo"
            //     }
            // ];
            let movements = {},
            month;
            for ( let movement of data) {
                month = moment(data['transactionDate']).format('MMMM').toLocaleUpperCase();
                if (!movements[month])
                    movements[month] = []
                movement['formatedDate'] = moment(movement['transactionDate']).format('dddd, DD [de] MMMM');
                movement['formatedTime'] = moment(movement['transactionDate']).format("hh:mm a");
                movements[month].push(movement);
            }
            this.movements = movements;
            this.hideLoading();
        }, err => {
            console.error(err);
            this.hideLoading();
        })
    }
}
