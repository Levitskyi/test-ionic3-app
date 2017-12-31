import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ListPopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list-popover',
  templateUrl: 'list-popover.html',
})
export class ListPopoverPage {
  stateText: string;
  dataText = [];

  constructor(
    public viewController: ViewController,
    private navParams: NavParams
  ) {
  }

  ionViewDidLoad() {
    // const data = this.navParams.get('data');
    this.stateText = this.navParams.get('defaultValue');
    this.dataText = this.navParams.get('dataList');
    console.log(this.dataText);
    console.log(this.stateText);
  }

  close() {
    this.viewController.dismiss();
  };

  changeState() {
    if (this.stateText) {
      this.viewController.dismiss(this.stateText);
    }
  }

}
