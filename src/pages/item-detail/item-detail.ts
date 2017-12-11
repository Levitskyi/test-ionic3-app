import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Items } from '../../providers/providers';
import {HttpClient} from "@angular/common/http";

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  baseImageUrl = 'https://www.cryptocompare.com';
  item: any;
  chartOptions: any;
  groupingUnits = [[
    'week',                         // unit name
    [1]                             // allowed multiples
  ], [
    'month',
    [1, 2, 3, 4, 6]
  ]];

  constructor(
    public navCtrl: NavController, navParams: NavParams, items: Items,
    private http: HttpClient
  ) {
    this.item = navParams.get('item') || items.defaultItem;
    console.log(this.item);

    const url = 'https://min-api.cryptocompare.com/data/histominute?fsym=BTC&tsym=USD&limit=1500';
    const url_1 = 'https://min-api.cryptocompare.com/data/histoday?fsym=ETH&tsym=USD&limit=60&aggregate=3&e=Kraken&extraParams=Ionic-StockCurrency-App';
    this.http.get(url).subscribe((result: any) => {
      console.log(result);
      const dataArr = result.Data.map(elem => {
        const newArr = [];
        newArr[0] = elem.time*1000;
        newArr[1] = elem.open;
        newArr[2] = elem.high;
        newArr[3] = elem.low;
        newArr[4] = elem.close;
        return newArr;
      });
      const dataArrVolume = result.Data.map(elem => {
        const newArr = [];
        newArr[0] = elem.time;
        newArr[1] = elem.volumeto;
        return newArr;
      });

      console.log(dataArrVolume);
      console.log(dataArr);
      this.chartOptions = {
        chart: {
          width: 300,
          type: 'candlestick',
          zoomType: 'x'
        },
        rangeSelector: {
          buttons: [{
            type: 'hour',
            count: 1,
            text: '1h'
          }, {
            type: 'day',
            count: 1,
            text: '1d'
          },
          {
            type: 'month',
            count: 1,
            text: '1m'
          }, {
            type: 'year',
            count: 1,
            text: '1y'
          }, {
            type: 'all',
            text: 'All'
          }],
          inputEnabled: false, // it supports only days
          selected: 2 // all
        },
        xAxis: {
          events: {
            afterSetExtremes: this.afterSetExtremes
          },
          minRange: 3600 * 1000 // one hour
        },

        yAxis: {
          floor: 0
        },

        title: {
          text: 'AAPL Stock Price'
        },
        series: [{
          data: dataArr,
          tooltip: {
            valueDecimals: 2
          }
        }]
      }

      // this.chartOptions = {
      //   chart: {
      //     width: 400
      //   },
      //   rangeSelector: {
      //     selected: 1
      //   },
      //
      //   title: {
      //     text: 'AAPL Historical'
      //   },
      //
      //   yAxis: [{
      //     labels: {
      //       align: 'right',
      //       x: -3
      //     },
      //     title: {
      //       text: 'OHLC'
      //     },
      //     height: '60%',
      //     lineWidth: 2,
      //     resize: {
      //       enabled: true
      //     }
      //   }, {
      //     labels: {
      //       align: 'right',
      //       x: -3
      //     },
      //     title: {
      //       text: 'Volume'
      //     },
      //     top: '65%',
      //     height: '35%',
      //     offset: 0,
      //     lineWidth: 2
      //   }],
      //
      //   tooltip: {
      //     split: true
      //   },
      //
      //   series: [{
      //     type: 'candlestick',
      //     name: 'AAPL',
      //     data: dataArr,
      //     dataGrouping: {
      //       units: this.groupingUnits
      //     }
      //   }, {
      //     type: 'column',
      //     name: 'Volume',
      //     data: dataArrVolume,
      //     yAxis: 1,
      //     dataGrouping: {
      //       units: this.groupingUnits
      //     }
      //   }]
      // };
    });


  }

  afterSetExtremes(e) {
    console.log(e);
  }

}
