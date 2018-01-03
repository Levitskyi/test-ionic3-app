import {Component, ViewChild} from '@angular/core';
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
  chart: any;
  chartData = [];
  generalInfo: any;
  tabs = 'description';
  chartState: string;

  constructor(
    public navCtrl: NavController, navParams: NavParams, items: Items,
    public http: HttpClient
  ) {
    this.item = navParams.get('item') || items.defaultItem;
    this.getGeneralInfo(+this.item.Id);
    this.getChartDat();
  }

  getChartDat() {
    const url = 'https://min-api.cryptocompare.com/data/histominute?fsym=BTC&tsym=USD&limit=1444';
    const url_1 = 'https://min-api.cryptocompare.com/data/histoday?fsym=ETH&tsym=USD&limit=60&aggregate=3&e=Kraken&extraParams=Ionic-StockCurrency-App';
    this.http.get(url).subscribe((result: any) => {
      const dataArr = this.generateChartData(result);
      this.chartOptions = {
        chart: {
          width: window.innerWidth,
          type: 'candlestick',
          zoomType: 'x'
        },
        navigator: {
          adaptToUpdatedData: false,
          series: {
            data: dataArr
          }
        },
        rangeSelector: {
          allButtonsEnabled: true,
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
          selected: 1 // day
        },
        xAxis: {
          minRange: 3600 * 1000 // one hour
        },

        yAxis: {
          floor: 0
        },
        scrollbar: {
          enabled: false
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
      this.chartState = 'dayHour';
    });


  }

  afterSetExtremes(e) {
    // console.log(e.rangeSelectorButton.type);

    // const url = 'https://min-api.cryptocompare.com/data/histominute?fsym=BTC&tsym=USD&limit=1444';
    // this.http.get(url).subscribe((result: any) => {
    //   const dataArr = result.Data.map(elem => {
    //     const newArr = [];
    //     newArr[0] = elem.time*1000;
    //     newArr[1] = elem.open;
    //     newArr[2] = elem.high;
    //     newArr[3] = elem.low;
    //     newArr[4] = elem.close;
    //     return newArr;
    //   });
    //   this.chartData = dataArr;
    // });
    // chart.showLoading('Loading data from server...');
  }

  onAfterSetExtremesX(e) {
    if(e.originalEvent.rangeSelectorButton) {
      console.log(e);
      switch (e.originalEvent.rangeSelectorButton.type) {
        case 'hour': {
          if (this.chartState !== 'dayHour') {
            this.getDayHourData();
            this.chartState = 'dayHour';
          }
          break;
        }
        case 'day': {
          if (this.chartState !== 'dayHour') {
            this.getDayHourData();
            this.chartState = 'dayHour';
          }
          break;
        }
        case 'month': {
          if (this.chartState !== 'month') {
            this.getMonthData();
            this.chartState = 'month';
          }
          break;
        }
        case 'year': {
          console.log('year');
        }
      }
    }
  }

  getMonthData() {
    this.chart.showLoading('Loading data from server...');
    const url = 'https://min-api.cryptocompare.com/data/histohour?fsym=BTC&tsym=USD&limit=750';
    this.http.get(url).subscribe((result: any) => {
      const chartData = this.generateChartData(result);
      setTimeout(() => {
        this.chart.series[0].setData(chartData);
        this.chart.xAxis[0].setExtremes('month');
        this.chart.hideLoading();
      }, 1000);
    });
  }

  getDayHourData() {
    this.chart.showLoading('Loading data from server...');
    const url = 'https://min-api.cryptocompare.com/data/histominute?fsym=BTC&tsym=USD&limit=1444';
    this.http.get(url).subscribe((result: any) => {
      const chartData = this.generateChartData(result);
      this.chart.series[0].setData(chartData);
      this.chart.hideLoading();
    });
  }

  saveInstance(chartInstance) {
    this.chart = chartInstance;
  }

  generateChartData(items) {
    return items.Data.map(elem => {
      const newArr = [];
      newArr[0] = elem.time*1000;
      newArr[1] = elem.open;
      newArr[2] = elem.high;
      newArr[3] = elem.low;
      newArr[4] = elem.close;
      return newArr;
    });
  }

  generateVolumeData(items) {
    return items.Data.map(elem => {
      const newArr = [];
      newArr[0] = elem.time;
      newArr[1] = elem.volumeto;
      return newArr;
    });
  }

  getGeneralInfo(id) {
    this.http.get('https://www.cryptocompare.com/api/data/coinsnapshotfullbyid/?id=' + id).subscribe((result: any) => {
      this.generalInfo = result.Data.General;
    });
  }

}
