// Angular components
import { Component } from '@angular/core';

// Ionic components
import { NavController, NavParams } from 'ionic-angular';

// Pages
import { TravelsApprovalsEventsPage } from '../travels-approvals-events';
import { TravelsApprovalsAdvancesPage } from '../travels-approvals-advances';

@Component({
    selector: 'travels-approvals-page',
    templateUrl: './travels-approvals.html'
})

export class TravelsApprovalsPage {
    _menuOptions = [
        {
            page: TravelsApprovalsEventsPage,
            title: 'Informes'
        },
        {
            page: TravelsApprovalsAdvancesPage,
            title: 'Anticipos'
        },
    ]
    constructor (
        private navCtrl: NavController,
        private navParams: NavParams,
    ) {
        this._menuOptions[0]['badge'] = this.navParams.get('events');
        this._menuOptions[1]['badge'] = this.navParams.get('advances');
    }
}
