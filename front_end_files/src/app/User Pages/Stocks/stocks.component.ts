import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StocksService } from './stocks.service';
import { Stock } from './stocks.model';
import { Chart } from 'node_modules/chart.js';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { MatSelectChange } from '@angular/material/select';


@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {

  public _date: Number[] = [];
  public _closeAdj: Number[]= []; 
  public _open: Number[]=[];
  public _high: Number[] =[];
  public _low: Number[] =[]; 
  public _close: Number[] =[];
  public _volume: Number[]=[];  
  tempArray: Stock[] = [];
  public Data: Stock[];
  public high_today;
  public low_today; 
  public open_today; 
  public close_today; 
  public percentage : string; 

  selectedStock: string = 'none'; 

  stocks;
  favoriteArray: any = [

  ]; 
  constructor(private stocksService: StocksService) { }

  ngOnInit() {
    // this.getChartValues();
    // this.createLineChart(this._date, this._closeAdj,this._high, this._low, this._open,this._close,this._volume);
    // console.log(this._high);
    this.onChartSelected();
    this.stockSelection(); 
  }

  onChartSelected(){
    // alert('Stock selected');
    this.clearData(this._date, this._closeAdj,this._high, this._low, this._open,this._close,this._volume); 
    this.getChartValues();
    this.createLineChart(this._date, this._closeAdj,this._high, this._low, this._open,this._close,this._volume);
    // console.log(this._high);
  }

  getChartValues(){

    this.stocksService.getStockData(this.selectedStock)
     .subscribe((data) => {
      this.Data = data; 
      for( var i = 0; i <this.Data.length; i++){
      this._date.push(this.Data[i].Date);
      this._closeAdj.push(this.Data[i].AdjClose);
      this._high.push(this.Data[i].High);
      this._low.push(this.Data[i].Low);
      this._open.push(this.Data[i].Open); 
      this._close.push(this.Data[i].Close);
      this._volume.push(this.Data[i].Volume);

      }
      this.high_today = this.Data[this.Data.length-1].High;
      this.low_today = this.Data[this.Data.length-1].Low; 
      this.open_today = this.Data[this.Data.length-1].Open;
      this.close_today = this.Data[this.Data.length-1].Close;
      this.percentage = "(" + (this.close_today - this.open_today).toFixed(2) + ")" ;
     });
  }




  createLineChart(_date: any, _closeAdj: any, _high: any, _low:any, _open:any, _close:any, _volume: any ) {
    
    var myChart = new Chart('myChart', {
      type: 'line',
      data: {
        labels: _date,
        datasets: [{
          label: 'High',
          data: _high,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        },
        {
          label: 'Low',
          data: _low,
          showLine: false, 
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)'
          ],
          borderColor: [
             'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        },
        {
          label: 'Close',
          data: _close,
        }
      ]
      },
      options: {
        legend: {
          display: true
      },
        tooltips: {
          mode: 'index',
          intersect: true
       },
      }
    });

    

  }
  clearData(_date: any, _closeAdj: any, _high: any, _low:any, _open:any, _close:any, _volume: any ){
    this._date = [];
    this._closeAdj = [];
    this._high = []; 
    this._low = []
    this._open = [];
    this._close = []; 
    this._volume =[];

  }

stockSelection(){
  this.stocksService.getStockSelection()
  .subscribe((data) => {
    // console.log(data); 
    this.stocks = data; 
    })
    
}


}
