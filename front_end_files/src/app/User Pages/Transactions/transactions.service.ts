import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transactions } from './transactions.model';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';


@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private url = 'http://localhost:3000/api/trades/trades';
  constructor(private http: HttpClient) { }



  // getTransactions(): Observable<Transactions[]> {
  //   return this.http.get<Transactions[]>(this.url);
  // }

  getTransactions(){
      return this.http.get("./assets/data/transaction_history.json");
    }

}



