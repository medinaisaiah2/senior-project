import { ContentObserver } from '@angular/cdk/observers';
import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UserBalanceService } from 'src/app/services/userBalace.service';
import { timer } from 'rxjs';
import { Input } from '@angular/core';

@Injectable()
@Component({
  selector: 'app-trading',
  templateUrl: './trading.component.html',
  styleUrls: ['./trading.component.css']
})
export class TradingComponent implements OnInit, OnDestroy{
  isAuthenticated = false;
  private userSub: Subscription;
  data;
  public depositAmount: number; 
  public startingBalance: any; 
  public updatedBalance: any; 
  public userBalance: number = 100;

  
  


  //here we are importing AuthService at the top and adding to cunstructor to be able to use
  constructor(private UserBalance: UserBalanceService){ //AuthService will be used to know if the user is still logged in and which pages to show
    this.UserBalance.balanceUpdated.subscribe(
      (status: number) => alert('New Status: ' + status)
    );
  }
  

  ngOnInit(){
   this.startingBalance = this.UserBalance.getUserbalance(); 
   this.updatedBalance = this.UserBalance.getUserbalance();
  }

  ngOnDestroy(){ //added to clear subscription
    this.userSub.unsubscribe();
  }

  onDeposit(depositAmount: number){
    this.UserBalance.balanceUpdated.emit(depositAmount); 
   this.updatedBalance= this.UserBalance.getUserbalance();
  }

}
