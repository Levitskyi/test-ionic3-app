import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';

import { Item } from '../../models/item';
import { Items } from '../../providers/providers';
import { HttpClient } from '@angular/common/http';
import coinList from '../../mocks/data/coinItemsList.mock';

// declare var io;

// interface Coin {
//   Id: string;
//   ImageUrl: string;
//   Name: string;
//   CoinName: string;
//   FullName: string;
//   SortOrder: string;
// }

@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  currentItems: Item[];

  coinItems = [];
  allowedCoinItems = [];
  baseImageUrl: string = 'https://www.cryptocompare.com';
  pricesList: any;
  socket_url = 'wss://streamer.cryptocompare.com/';
  priceForBTC: any;

  constructor(
    public navCtrl: NavController,
    public items: Items,
    public modalCtrl: ModalController,
    private http: HttpClient,
    ) {
    this.currentItems = this.items.query();
    // const socket = io.connect(this.socket_url);
    // var subscription = ['5~CCCAGG~BTC~USD', '5~CCCAGG~ETH~USD'];
    // socket.emit('SubAdd', { subs: subscription });
    // socket.on("m", function(message) {
    //   console.log(message);
    // });
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
    const symbolArray = [];
    coinList.forEach((elem, index) => {
      if(index < 15) {
        symbolArray.push(elem.Symbol);
        this.allowedCoinItems.push(elem);
      }
    });
    this.getPrices(symbolArray.join(','));
    this.getPriceForBTC();
  }

  getPriceForBTC() {
    const urlForBTC = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC&tsyms=USD`;
    this.http.get(urlForBTC).subscribe((result: any) => {
      this.priceForBTC = result.DISPLAY;
    });
  }

  getPrices(symbols: string) {
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbols}&tsyms=BTC`;
    this.http.get(url).subscribe((result: any) => {
      this.pricesList = result.DISPLAY;
      this.coinItems = this.allowedCoinItems;
    });
  }

  showPrice(symbol: string) {
    if (this.priceForBTC) {
      return symbol === 'BTC' ? this.priceForBTC[symbol].USD.PRICE : this.pricesList[symbol].BTC.PRICE;
    }
  }

  getChange(symbol: string) {
    if(this.priceForBTC) {
      return symbol === 'BTC' ? this.priceForBTC[symbol].USD.CHANGEPCT24HOUR : this.pricesList[symbol].BTC.CHANGEPCT24HOUR;
    }
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addItem() {
    let addModal = this.modalCtrl.create('ItemCreatePage');
    addModal.onDidDismiss(item => {
      if (item) {
        this.items.add(item);
      }
    })
    addModal.present();
  }

  /**
   * Delete an item from the list of items.
   */
  deleteItem(item) {
    this.items.delete(item);
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item) {
    this.navCtrl.push('ItemDetailPage', {
      item: item
    });
  }
}
