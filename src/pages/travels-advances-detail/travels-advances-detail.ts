import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AdvancesProvider } from '../../providers/advances';
import { LoadingMessages } from '../../helpers/loading';

/**
 * Generated class for the TravelsAdvancesDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-travels-advances-detail',
  templateUrl: 'travels-advances-detail.html',
})
export class TravelsAdvancesDetailPage {
  advance: Object;
  approve: Boolean = false;
  comment: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private provider: AdvancesProvider,
    private loadingMessages: LoadingMessages
  ) {}

  ionViewDidEnter() {
    this.loadingMessages.create('Cargando...');
    this.approve = this.navParams.get('approve');
    this.provider.get(this.navParams.get('id')).subscribe(data => {
      this.loadingMessages.hide(0);
      this.advance = data;
    })
  }
  approveAdvance() {
    this.loadingMessages.create('Espere...');
    this.provider.approve(this.advance['id'], this.comment).subscribe(data => {
      this.loadingMessages.hide(0);
      this.navCtrl.pop();
    }, error => {
      this.loadingMessages.hide(0);
    })
  }
  rejectAdvance() {
    this.loadingMessages.create('Espere...');
    this.provider.reject(this.advance['id'], this.comment).subscribe(data => {
      this.loadingMessages.hide(0);
      this.navCtrl.pop();
    }, error => {
      this.loadingMessages.hide(0);
    })
  }
}
