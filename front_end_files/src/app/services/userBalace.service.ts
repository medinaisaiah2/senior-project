import { EventEmitter, Injectable, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';




@Injectable({
    providedIn: 'root'
})
export class UserBalanceService {
    public UserBalance: number = 100;

    //trying out event emmitter
    balanceUpdated = new EventEmitter<number>(); 

    constructor(private http: HttpClient) { }

    calculateUserBalance(temp: number) {
      return this.UserBalance = +this.UserBalance + +temp;
    }
    getUserbalance() {
        return this.UserBalance;
    }
}