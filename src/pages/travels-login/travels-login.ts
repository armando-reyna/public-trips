// Angular components
import { Component, isDevMode } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

// Ionic components
import { App, NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from 'ionic-native';

// Helpers
import { ToastMessages } from '../../helpers/toast';
import { TravelsConstants } from '../../helpers/travels-constants';
import { LoadingMessages } from '../../helpers/loading';

// Pages
import { TravelsRecoveryPage } from '../travels-recovery';
import { TravelsFirstPasswordPage } from '../travels-first-password';
import { TravelsTabsPage } from '../travels-tabs';

// Providers
import { TravelsService } from '../../providers/travels-service'


@Component({
    selector: 'travels-login-page',
    templateUrl: './travels-login.html'
})

export class TravelsLoginPage {

    /**
     * @property _loginButtonText
     * @description Used to set text in the login button
     */
    public _loginButtonText = 'Iniciar sesión';

    /**
     * @property _lastUsername
     * @description Used to set the lst username
     */
    public _lastUsername = '';

    /**
     * @property _formLoginGroup
     * @description Model for login form
     */
    public _formLoginGroup: FormGroup;

    /**
     * @property _messages
     * @description Used to store the travelsConstants messages.
     */
    private _messages: Object = {};

    /**
     * @property _loading
     * @description Used to bloq the elements when try login
     */
    private _loading: boolean = false;

    /**
     * @property _groupLoginSettings
     * @description Used to store the form validations and settings
     */
    private _groupLoginSettings: Object = {
        username: ['',
            [
                Validators.required,
                Validators.pattern(this.travelsConstants._emailPattern)
            ]
        ],
        password: ['', Validators.required]
    };

    devMode;

    constructor (
        public app: App,
        public navCtrl: NavController,
        public navParams: NavParams,
        public toastMessages: ToastMessages,
        private travelsConstants: TravelsConstants,
        public formBuilder: FormBuilder,
        public loadingMessages: LoadingMessages,
        public travelsService: TravelsService
    ) {
        // Store the travels constants messages in component property
        this._messages = this.travelsConstants._messages;

        // Settings validations for login form
        this._formLoginGroup = this.formBuilder.group(this._groupLoginSettings);
        this.devMode = isDevMode();
    }

    private hideLoading(): void {
        this._loading = false;
        this.loadingMessages.hide(0);
    }

    private showLoading(): void {
        this._loading = true;
        this.loadingMessages.create('Iniciando...');
    }

    private showToastMessage(message: string, time: number): void {
        this.toastMessages.show(message);
        this.toastMessages.hide(time);
    }

    private manageServiceFail(): void {
        this.showToastMessage(this._messages['userServiceFail'], 4000);
        this.hideLoading();
    }

    private manageLoginFail(): void {
        this.showToastMessage(this._messages['userLoginFail'], 4000);
        this.hideLoading();
    }

    private resetForm(): void {
        this._formLoginGroup.reset();
    }

    private setUserStorage(userData: Object): void {
        NativeStorage.setItem('currentUser', JSON.stringify(userData))
        .then(responseSet => {
            const siValeId = userData['clients'][0]['sivaleId'];
            return NativeStorage.setItem('siValeId', siValeId);
        })
        .then(responseSet => {
            return NativeStorage.setItem('product', 'inteliviajes')
        })
        .then(responseSet => {
            return NativeStorage.setItem('lastEmail', userData['email'])
        })
        .then(responseSet => {
            this.resetForm();
            this.hideLoading();

            userData['redirect'] === 'ChangePasswordPage'
                ? this.navCtrl.setRoot(TravelsFirstPasswordPage)
                : this.navCtrl.setRoot(TravelsTabsPage);
        })
        .catch(errorSet => {
            this.manageServiceFail();
        });
    }

    private getSessionToken(responseLogin: Object): void {
        this.travelsService.getSessionToken(responseLogin)
        .subscribe(responseToken => {

            NativeStorage.setItem('tSessionToken', responseToken)
            .then(responseSet => { this.setUserStorage(responseLogin); })
            .catch(errorSet => { this.manageLoginFail(); });

        }, errorToken => {
            this.manageLoginFail();
        });
    }

    private evalResponseLogin(responseLogin: Object): void {
        responseLogin['authenticationToken']
            ? this.getSessionToken(responseLogin)
            : this.manageLoginFail();
    }

    /**
     * @function login
     * @description
     * Login with the username and password
     */
    public login(): void {
        this.showLoading();

        this.travelsService.login(this._formLoginGroup.value)
        .subscribe(responseLogin => {
            this.evalResponseLogin(responseLogin);
        }, err => {
            this.showToastMessage(err._body, 4000);
            this.hideLoading();
        });
    }

    public goRecoveryPassword(): void {
        this.navCtrl.push(TravelsRecoveryPage);
    }

    ionViewDidLoad () {
        NativeStorage.getItem('lastEmail')
        .then(responseGet => { this._lastUsername = responseGet; })
        .catch(errorGet => {});
    }
}
