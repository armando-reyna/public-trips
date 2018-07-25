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
export class AdvancesProvider {

    constructor(
        public http: Http,
        public appConstants: AppConstants,
        public travelsConstants: TravelsConstants,
    ) {}

    get(id?): Observable<Object> {
        return Observable.fromPromise(NativeStorage.getItem('tSessionToken'))
        .mergeMap(token => {
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + token);
            let endPoint = '/secure/advances';
            if (id) {
                endPoint += '/' + id;
            }
            // Request http
            return this.http.get(
                this.appConstants.travelsUrl + endPoint,
                { headers }
            ).map(responseInvoices => {
                responseInvoices = responseInvoices.json();
                return responseInvoices;
            });
        });
    }
    save(data): Observable<Object> {
        return Observable.fromPromise(NativeStorage.getItem('tSessionToken'))
        .mergeMap(token => {
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + token);

            let request;
            if (data['id']) {
                request = this.http.patch(
                    this.appConstants.travelsUrl + '/secure/advances',
                    data,
                    { headers }
                ).map(responseInvoices => {
                    responseInvoices = responseInvoices.json();
                    return responseInvoices;
                });
            } else {
                request = this.http.post(
                    this.appConstants.travelsUrl + '/secure/advances',
                    data,
                    { headers }
                ).map(responseInvoices => {
                    responseInvoices = responseInvoices.json();
                    return responseInvoices;
                });
            }
            return request;
        });
    }
    pending(): Observable<Object> {
        return Observable.fromPromise(NativeStorage.getItem('tSessionToken'))
        .mergeMap(token => {
            // Headers
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + token);

            // Request http
            return this.http.get(
                this.appConstants.travelsUrl + '/secure/advances/pending',
                { headers }
            ).map(responseInvoices => {
                responseInvoices = responseInvoices.json();
                return responseInvoices;
            });
        });
    }
    approve(id, comment?): Observable<Object> {
        return Observable.fromPromise(NativeStorage.getItem('tSessionToken'))
        .mergeMap(token => {
            // Headers
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + token);

            // Request http
            return this.http.post(
                this.appConstants.travelsUrl + '/secure/advances/approve?id=' + id + '&comment=' + comment,
                {},
                { headers }
            ).map(responseInvoices => {
                responseInvoices = responseInvoices.json();
                return responseInvoices;
            });
        });
    }
    reject(id, comment?): Observable<Object> {
        return Observable.fromPromise(NativeStorage.getItem('tSessionToken'))
        .mergeMap(token => {
            // Headers
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + token);

            // Request http
            return this.http.post(
                this.appConstants.travelsUrl + '/secure/advances/reject?id=' + id + '&comment=' + comment,
                {},
                { headers }
            ).map(responseInvoices => {
                responseInvoices = responseInvoices.json();
                return responseInvoices;
            });
        });
    }
}
