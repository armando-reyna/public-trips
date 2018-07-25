import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { NativeStorage } from 'ionic-native';

import { AdvancesProvider } from '../../providers/advances';
import { LoadingMessages } from '../../helpers/loading';

import { TravelsAdvancesCreatePage } from '../travels-advances-create';
import { TravelsAdvancesDetailPage } from '../travels-advances-detail';

/**
 * Generated class for the TravelsAdvancesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'travels-approvals-advances-page',
  templateUrl: 'travels-approvals-advances.html',
})
export class TravelsApprovalsAdvancesPage {
  advances: Array<Object> = [];
  pending: Array<Object> = []
  cardAvailable: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public provider: AdvancesProvider,
    private loadingMessages: LoadingMessages
  ) {}

  ionViewWillEnter(refresher?) {
    this.loadingMessages.create('Cargando...');
    // this.getAdvances(refresher);
    this.getPending(refresher);
    // this.getCard();
  }
  getCard() {
    NativeStorage.getItem('selectedCard').then(card => {
      if (card)
        this.cardAvailable = true;
    });
  }
  getAdvances(refresher?) {
    this.provider.get().subscribe((data: Array<Object>) => {
      this.loadingMessages.hide(0);
      this.advances = data;
      if (refresher)
          refresher.complete();
    }, error => {
      this.loadingMessages.hide(0);
      if (refresher)
          refresher.complete();
    });
  }
  getPending(refresher?) {
    this.provider.pending().subscribe((data: Array<Object>) => {
      this.loadingMessages.hide(0);
      this.pending = data;
      if (refresher)
          refresher.complete();
    }, error => {
      this.loadingMessages.hide(0);
      if (refresher)
          refresher.complete();
    });
  }
  goToAdvanceDetail(id) {
    this.navCtrl.push(TravelsAdvancesDetailPage, {
      id: id
    });
  }
  goToPendingAdvanceDetail(id) {
    this.navCtrl.push(TravelsAdvancesDetailPage, {
      id: id,
      approve: true
    });
  }
}
