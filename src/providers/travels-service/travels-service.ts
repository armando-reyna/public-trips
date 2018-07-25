// Angular components
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

// Ionic components
import { NativeStorage } from 'ionic-native';

// Import Observables and dependencies
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';

//Helpers
import { AppConstants } from '../../helpers/constants';
import { TravelsConstants } from '../../helpers/travels-constants';

@Injectable()
export class TravelsService {

    constructor(
        public http: Http,
        public appConstants: AppConstants,
        public travelsConstants: TravelsConstants,
    ) {}

    /**
     * @function login
     * @description
     * Method for login in the app with inteliviajes login.
     *
     * @param  {Object}             form form data
     * @return {Observable<Object>}      Observable with response
     */
    login(form: Object): Observable<Object> {
        // Headers
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        // Users data
        const userData = {
            user: form['username'].toLowerCase(),
            password: form['password'],
            origin: 'APPM',
            rol: '5'
        };

        // Request http
        return this.http.post(
            this.appConstants.travelsUrl + '/user/login',
            userData,
            { headers }
        ).map(responseLogin => {
            return responseLogin.json();
        });
    }

    /**
     * @function getSessionToken
     * @description
     * Method to get the session token
     *
     * @param  {Object}             userData form data
     * @return {Observable<Object>}          Observable with response
     */
    getSessionToken(userData): Observable<Object> {
        // Headers
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + userData['authenticationToken']);

        // Users data
        const tokenData = {
            client: userData['clients'][0],
            email: userData['email'],
            origin: 'APPM',
            roleId: '5'
        };

        // Request http
        return this.http.post(
            this.appConstants.travelsUrl + '/secure/user/sessionToken',
            tokenData,
            { headers }
        ).map(responseLogin => {
            responseLogin = JSON.parse(JSON.stringify(responseLogin));
            return responseLogin['_body'];
        });
    }

    /**
     * @function resetPassword
     * @description
     * Method to reset the user password
     *
     * @param  {Object}             form form data
     * @return {Observable<Object>}      Observable with response
     */
    resetPassword(form: Object): Observable<Object> {
        // Headers
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        // Users data
        const email = form['username'].replace('@', '%40');

        // Request Http
        return this.http.get(
            this.appConstants.travelsUrl + '/user/resetPassword?email='
                + email.toLowerCase()
                + '&origin=APPM',
            { headers }
        ).map(responseLogin => {
            return responseLogin;
        })
    }

    logout(): any {
        return new Promise((resolve, reject) => {
            NativeStorage.remove('currentUser')
            .then(responseRemove => {
                return NativeStorage.remove('product');
            })
            .then(responseRemove => {
                return NativeStorage.remove('tSessionToken');
            })
            .then(responseRemove => {
                resolve(true);
            })
            .catch(errorRemove => {
                reject('Error al cerrar sesión');
            });
        });
    }

    updatePassword(form: Object): Observable<Object> {
        return Observable.fromPromise(NativeStorage.getItem('tSessionToken'))
        .mergeMap(token => {
            // Headers
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + token);

            // User data
            const userData = {
                confirmedPassword: form['password'],
                password: form['password']
            };

            // Request http
            return this.http.patch(
                this.appConstants.travelsUrl + '/secure/user/updatePassword',
                userData,
                { headers }
            ).map(responseUpdatePassword => {
                responseUpdatePassword = responseUpdatePassword.json();
                return responseUpdatePassword;
            });
        });
    }

    getUserInfo(siValeId: any): Observable<Object> {
        return Observable.fromPromise(NativeStorage.getItem('tSessionToken'))
        .mergeMap(token => {
            // Headers
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + token);

            // Request http
            return this.http.get(
                this.appConstants.travelsUrl + '/secure/user?sivaleId=' + siValeId,
                { headers }
            ).map(responseRfc => {
                responseRfc = responseRfc.json();
                return responseRfc;
            });
        });
    }

    getRfc(): Observable<Object> {
        return Observable.fromPromise(NativeStorage.getItem('tSessionToken'))
        .mergeMap(token => {
            // Headers
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + token);

            // Request http
            return this.http.get(
                this.appConstants.travelsUrl + '/secure/rfc',
                { headers }
            ).map(responseRfc => {
                responseRfc = responseRfc.json();
                return responseRfc;
            });
        });
    }

    getTransactions(iut: string): Observable<Object> {
        return Observable.fromPromise(NativeStorage.getItem('tSessionToken'))
        .mergeMap(token => {
            // Headers
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + token);

            // Request http
            return this.http.get(
                this.appConstants.travelsUrl + '/secure/transactionEC?iut=' + iut,
                { headers }
            ).map(responseTransactions => {
                responseTransactions = responseTransactions.json();
                return responseTransactions;
            });
        });
    }

    saveEvent(event): Observable<Object> {
        return Observable.fromPromise(NativeStorage.getItem('tSessionToken'))
        .mergeMap(token => {
            // Headers
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + token);
            // User data
            let request: any;
            if (event['id']) {
                request = this.http.patch(
                    this.appConstants.travelsUrl + '/secure/event',
                    event,
                    { headers }
                )
            } else {
                request = this.http.post(
                    this.appConstants.travelsUrl + '/secure/event',
                    event,
                    { headers }
                )
            }
            // Request http
            return request.map(responseSaveEvent => {
                responseSaveEvent = responseSaveEvent.json();
                return responseSaveEvent;
            });
        });
    }

    getEvents(id?): Observable<Object> {
        return Observable.fromPromise(NativeStorage.getItem('tSessionToken'))
        .mergeMap(token => {
            // Headers
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + token);

            // Request http
            let request;
            if (id) {
                request = '/secure/event?id=' + id;
            } else {
                request = '/secure/events';
            }
            return this.http.get(
                this.appConstants.travelsUrl + request,
                { headers }
            ).map(responseSaveEvent => {
                responseSaveEvent = responseSaveEvent.json();
                return responseSaveEvent;
            });
        });
    }

    updateEvent(event: any): Observable<Object> {
        return Observable.fromPromise(NativeStorage.getItem('tSessionToken'))
        .mergeMap(token => {
            // Headers
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + token);

            // Request http
            return this.http.patch(
                this.appConstants.travelsUrl + '/secure/event',
                event,
                { headers }
            ).map(responseUpdate => {
                responseUpdate = responseUpdate.json();
                return responseUpdate;
            });
        });
    }

    approveEvent(eventId: Object): Observable<Object> {
        return Observable.fromPromise(NativeStorage.getItem('tSessionToken'))
        .mergeMap(token => {
            // Headers
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + token);

            // Request http
            return this.http.post(
                this.appConstants.travelsUrl + '/secure/event/approve?id=' + eventId,
                {},
                { headers }
            ).map(responseApprove => {
                responseApprove = responseApprove.json();
                return responseApprove;
            });
        });
    }

    rejectEvent(eventId: Object): Observable<Object> {
        return Observable.fromPromise(NativeStorage.getItem('tSessionToken'))
        .mergeMap(token => {
            // Headers
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + token);

            // Request http
            return this.http.post(
                this.appConstants.travelsUrl + '/secure/event/reject?id=' + eventId,
                {},
                { headers }
            ).map(responseApprove => {
                responseApprove = responseApprove.json();
                return responseApprove;
            });
        });
    }

    deleteEvent(event: any): Observable<Object> {
        return Observable.fromPromise(NativeStorage.getItem('tSessionToken'))
        .mergeMap(token => {
            // Headers
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + token);

            // Request http
            return this.http.delete(
                this.appConstants.travelsUrl + '/secure/event?id=' + event,
                { headers }
            ).map(responseSaveEvent => {
                responseSaveEvent = responseSaveEvent.json();
                return responseSaveEvent;
            });
        });
    }

    getExpensesType(): Observable<Object> {
        return Observable.fromPromise(NativeStorage.getItem('tSessionToken'))
        .mergeMap(token => {
            // Headers
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + token);

            // Request http
            return this.http.get(
                this.appConstants.travelsUrl + '/secure/spendingType',
                { headers }
            ).map(responseExpensesType => {
                responseExpensesType = responseExpensesType.json();
                return responseExpensesType;
            });
        });
    }

    getPayMethod(): Observable<Object> {
        return Observable.fromPromise(NativeStorage.getItem('tSessionToken'))
        .mergeMap(token => {
            // Headers
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + token);

            // Request http
            return this.http.get(
                this.appConstants.travelsUrl + '/secure/payMethod',
                { headers }
            ).map(responsePayMethod => {
                responsePayMethod = responsePayMethod.json();
                return responsePayMethod;
            });
        });
    }

    saveExpense(expensesData: Object): Observable<Object> {
        return Observable.fromPromise(NativeStorage.getItem('tSessionToken'))
        .mergeMap(token => {
            // Headers
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + token);


            let request: any;
            if (expensesData['id']) {
                request = this.http.patch(
                    this.appConstants.travelsUrl + '/secure/spending',
                    expensesData,
                    { headers }
                )
            } else {
                request = this.http.post(
                    this.appConstants.travelsUrl + '/secure/spending',
                    expensesData,
                    { headers }
                )
            }
            // Request http
            return request.map(responseSave => {
                responseSave = responseSave.json();
                return responseSave;
            });
        });
    }

    updateExpense(expense: any): Observable<Object> {
        return Observable.fromPromise(NativeStorage.getItem('tSessionToken'))
        .mergeMap(token => {
            // Headers
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + token);

            // Request http
            return this.http.patch(
                this.appConstants.travelsUrl + '/secure/spending',
                expense,
                { headers }
            ).map(responseUpdate => {
                responseUpdate = responseUpdate.json();
                return responseUpdate;
            });
        });
    }

    deleteExpenses(expenseId: any): Observable<Object> {
        return Observable.fromPromise(NativeStorage.getItem('tSessionToken'))
        .mergeMap(token => {
            // Headers
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + token);

            // Request http
            return this.http.delete(
                this.appConstants.travelsUrl + '/secure/spending?spendingID=' + expenseId,
                { headers }
            ).map(responseDeleteExpense => {
                responseDeleteExpense = responseDeleteExpense.json();
                return responseDeleteExpense;
            });
        });
    }

    getExpenses(id?): Observable<Object> {
        return Observable.fromPromise(NativeStorage.getItem('tSessionToken'))
        .mergeMap(token => {
            // Headers
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + token);

            // Request http
            let request;
            if (id) {
                request = '/secure/spending?spendingId=' + id;
            } else {
                request = '/secure/spendings';
            }
            return this.http.get(
                this.appConstants.travelsUrl + request,
                { headers }
            ).map(responseExpenses => {
                responseExpenses = responseExpenses.json();
                return responseExpenses;
            });
        });
    }

    uploadEvidence(formData: FormData, sessionToken: string): Observable<Object> {
        return Observable.fromPromise(NativeStorage.getItem('tSessionToken'))
        .mergeMap(token => {
            const headers = new Headers();
            headers.append('Authorization', 'Bearer ' + token);

            return this.http.post(
                this.appConstants.travelsUrl + '/secure/evidence',
                formData,
                { headers }
            ).map(responseEvidence => {
                responseEvidence = responseEvidence.json();
                return responseEvidence;
            });
        });
    }

    getCards(siValeId: string): Observable<Object> {
        return Observable.fromPromise(NativeStorage.getItem('tSessionToken'))
        .mergeMap(token => {
            // Headers
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + token);

            // Request http
            return this.http.get(
                this.appConstants.travelsUrl + '/secure/cards/user/' + siValeId,
                { headers }
            ).map(responseCards => {
                responseCards = responseCards.json();
                return responseCards;
            });
        });
    }

    getBalance(iut: string): Observable<Object> {
        return Observable.fromPromise(NativeStorage.getItem('tSessionToken'))
        .mergeMap(token => {
            // Headers
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + token);

            // Request http
            return this.http.get(
                this.appConstants.travelsUrl + '/secure/card/balance?iut=' + iut,
                { headers }
            ).map(responseBalance => {
                responseBalance = responseBalance.json();
                return responseBalance;
            });
        });
    }
    
    getMovements(iut: string): Observable<Object> {
        return Observable.fromPromise(NativeStorage.getItem('tSessionToken'))
        .mergeMap(token => {
            // Headers
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + token);

            // Request http
            return this.http.get(
                this.appConstants.travelsUrl + '/secure/card/movements/' + iut,
                { headers }
            ).map(responseBalance => {
                responseBalance = responseBalance.json();
                return responseBalance;
            });
        });
    }

    getEvidenceItem(id): Observable<Object> {
        return Observable.fromPromise(NativeStorage.getItem('tSessionToken'))
        .mergeMap(token => {
            // Headers
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + token);

            // Request http
            return this.http.get(
                this.appConstants.travelsUrl + '/secure/evidence?evidenceId=' + id,
                { headers }
            ).map(responseBalance => {
                responseBalance = responseBalance.json();
                return responseBalance;
            });
        });
    }

    sendEmail(form: Object): Observable<Object> {
        return Observable.fromPromise(NativeStorage.getItem('tSessionToken'))
        .mergeMap(token => {
            // Headers
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + token);

            // User data
            const userData = {
                emailBussiness: form['emailBussiness'] ? form['emailBussiness'] : '',
                nameBussiness: form['nameBussiness'] ? form['nameBussiness'] : '',
                commentBussiness: form['commentBussiness'] ? form['commentBussiness'] : ''
            };

            // Request http
            return this.http.post(
                this.appConstants.travelsUrl + '/secure/sendEmail',
                userData,
                { headers }
            ).map(responseSaveEvent => {
                return responseSaveEvent.json();
            });
        });
    }

    getInvoices(): Observable<Object> {
        return Observable.fromPromise(NativeStorage.getItem('tSessionToken'))
        .mergeMap(token => {
            // Headers
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + token);

            // Request http
            return this.http.get(
                this.appConstants.travelsUrl + '/secure/invoices',
                { headers }
            ).map(responseInvoices => {
                responseInvoices = responseInvoices.json();
                return responseInvoices;
            });
        });
    }

    getApprovalsEvents(): Observable<Object> {
        return Observable.fromPromise(NativeStorage.getItem('tSessionToken'))
        .mergeMap(token => {
            // Headers
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + token);

            // Request http
            return this.http.get(
                this.appConstants.travelsUrl + '/secure/events/pending',
                { headers }
            ).map(responseInvoices => {
                responseInvoices = responseInvoices.json();
                return responseInvoices;
            });
        });
    }
}
