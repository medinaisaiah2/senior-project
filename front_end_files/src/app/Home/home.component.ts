import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { exit } from 'process';
import { Observable, Subscription } from 'rxjs';
import { StocksDataService } from '../services/stockdata.service';
import { TransactionsService } from '../User Pages/Transactions/transactions.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isAuthenticated = false;
  private userSub: Subscription;
  Data;
  // public _company;
  // public _reccomendations;
  // public _sector;

  columnsToDisplay = ['Stock', 'Date', 'Transaction', 'Price', 'Amount', 'TotalPrice'];
  public dataArray: any = [];
  public lastTransaction: any = [];

  columnsRecomedation = ['Stock', 'Recomendation', 'Sector'];
  public recomendationArray: any = [];
  public recomendationTopTen: any = [];

  public temp;
  public _temp;

  //here we are importing AuthService at the top and adding to cunstructor to be able to use
  constructor(private stockData: StocksDataService, private transactionHistory: TransactionsService) { }



  ngOnInit() {
    this.getData();

  }

  getData() {
    this.getlastTransaction();
    // this.getTopTenData();
  }

  getlastTransaction() {
    var tmp: any[] = []; 
    this.transactionHistory.getTransactions()
    .subscribe((data) => {
      this.dataArray = data; 
      // console.log(this.dataArray.length) 
      for(var i =0; i < this.dataArray.length; i++ ){
        //console.log(this.dataArray[i][this.dataArray[i].length-1]);
        tmp.push(this.dataArray[i][this.dataArray[i].length-1]);
      }
this.lastTransaction = tmp; 
       console.log(this.lastTransaction)
    });
   
  }s
}



