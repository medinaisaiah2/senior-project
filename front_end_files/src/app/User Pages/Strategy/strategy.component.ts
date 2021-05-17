import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { StockData } from 'src/app/models/stocksData.model';
import { StocksDataService } from 'src/app/services/stockdata.service';
import { DataSource } from '@angular/cdk/collections';
import { UserBalanceService } from 'src/app/services/userBalace.service';

@Component({
  selector: 'app-strategy',
  templateUrl: './strategy.component.html',
  styleUrls: ['./strategy.component.css'],
})
export class StrategyComponent implements OnInit {
  isAuthenticated = false;
  private userSub: Subscription;
  public Sectors: any[] = [];
  public Company: string[] = [];
  public Recomendation: string[] = [];
  Data;
  public stockSectorArray: any = [];
  public strategyArray: string[] = [
    'Standard deviations',
    'Std',
    'RSI',
    'MACD',
    'Support-resistance',
    'Pair-trade'];

  //these variables hold the user input 
  public selectedSector: string = 'none';
  public selectedStocks: string = 'none';
  public strategySelected: string = 'none';
  public startingBalance: any;
  public updatedBalance: any;
  public depositAmount: number;
  public backtesting: boolean; 


  //to be used for reccomendations data 
  columnsToDisplay = ['Company', 'Recomendations', 'Sector'];
  public dataArray:any = [];


  public selectedStock: string = 'recomendations.json';
  constructor(private stockDataService: StocksDataService, private userBalance: UserBalanceService) { }


  onSectorClick() {
    console.log(this.selectedSector);
    this.onSectorSelected(this.selectedSector);
  }

  //for reccomendations data 
  //retrieves json object
  //and is used to generate chart
  //stores data into 

  getReccValues() {
    this.stockDataService.getStockData('recomendations.json')
      .subscribe((data) => {
        this.dataArray = data;
        this.Data = data;
        for (var i = 0; i < this.Data.length; i++) {

          if (!this.Sectors.includes(this.Data[i].Sector)) {
            this.Sectors.push(this.Data[i].Sector)
          }
          this.Company.push(this.Data[i].Company);
          this.Recomendation.push(this.Data[i].Recomendation);

          //pushing data into dataArray and converiting numbers strings
          this.dataArray[i].Sector = this.Data[i].Sector; 
          this.dataArray[i].Company = this.Data[i].Company; 
          this.dataArray[i].Recommendations = this.Data[i].Recommendations;
        }
        // console.log(this.Company);
        // console.log(this.Sectors);
        console.log(this.dataArray);
      });
  };
  // filters out the Company into Array by secotor
  onSectorSelected(selectedSector: string) {
    this.stockSectorArray = [];
    for (var i = 0; i < this.Data.length; i++) {
      if (this.selectedSector.includes(this.Data[i].Sector)) {
        this.stockSectorArray.push(this.Data[i].Company)
      }
    }
  }







  ngOnInit(): void {
    this.getReccValues();
    this.startingBalance = this.userBalance.getUserbalance();
    this.updatedBalance = this.userBalance.getUserbalance();
  }
}

