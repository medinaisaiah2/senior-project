import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {Transactions} from './transactions.model'; 
import { TransactionsService } from './transactions.service';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import {DataSource} from '@angular/cdk/collections';
 

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit{

  columnsToDisplay = ['Stock','Date','Transaction', 'Price', 'Amount','TotalPrice'];
  public dataArray; 



  constructor(private transactionsService: TransactionsService){};

  
  ngOnInit():void{
    // this.transactionsService.getTransactions()
    //  .subscribe((data) => {
    //    this.dataArray = data; 
    //    console.log(data) });

    this.transactionsService.getTransactions()
    .subscribe((data) => {
      this.dataArray = data; 
      // console.log(this.dataArray.length) 
      for(var i =0; i < this.dataArray.length; i++ ){
        console.log(this.dataArray[i])
          // for(var j = 0; j< this.dataArray[i].lenght; j++){
          //     console.log(this.dataArray[j]);
          // }
      }
    });

  }
}

