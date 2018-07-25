import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { NativeStorage } from 'ionic-native';

import { AdvancesProvider } from '../../providers/advances';
import { TravelsConstants } from '../../helpers/travels-constants';

/**
 * Generated class for the TravelsAdvancesCreatePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-travels-advances-create',
  templateUrl: 'travels-advances-create.html',
})
export class TravelsAdvancesCreatePage {
  data: Object = {
    amountRequired: null,
    name: null,
    description: null,
    iut: null
  };
  state: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private provider: AdvancesProvider,
    private travelsConstants: TravelsConstants,
  ) {
  }

  
  ionViewWillEnter(): void {
    NativeStorage.getItem('selectedCard').then(card => {
      this.data['iut'] = card['iut'];
    });
  }
  onSubmit() {
    this.state = 'wait';
    this.data['amountRequired'] = Number(this.data['amountRequired'].replace('$', '').replace(new RegExp(',', 'g'), ''));
    this.provider.save(this.data).subscribe(() => {
      this.state = 'success';
    }, err => {
      this.state = 'error';
    });
  }
  goBack() {
    this.navCtrl.pop();
  }
  errorBack() {
    this.state = null;
  }
}
