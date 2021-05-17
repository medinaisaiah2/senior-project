import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// Importing HttpClient module to communicte with REST API
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './Home/home.component';
import { TransactionsComponent } from './User Pages/Transactions/transactions.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoadingLogoComponent } from './Shared/loading-logo/loading-logo.component';
import {ChartsModule} from 'ng2-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

//angular material imports
import {MatInputModule} from '@angular/material/input'; 
import {MatCardModule} from '@angular/material/card'; 
import {MatButtonModule} from '@angular/material/button'; 
import {MatToolbarModule} from '@angular/material/toolbar'; 
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'; 
import { AuthInterceptor } from './auth/auth-interceptor';
import {MatGridListModule} from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { MatTableModule} from '@angular/material/table';
import { TransactionsService } from './User Pages/Transactions/transactions.service';
import { StocksComponent } from './User Pages/Stocks/stocks.component';
import { StocksService } from './User Pages/Stocks/stocks.service';
import {MatSelectModule} from '@angular/material/select';
import { TradingComponent } from './User Pages/Trading/trading.component';
import { StrategyComponent } from './User Pages/Strategy/strategy.component';
import { RobinhoodComponent } from './User Pages/Robinhood/robinhood.component';
import { UserBalanceService } from './services/userBalace.service';



//have to import services and in providers


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LoadingLogoComponent,
    LoginComponent,
    SignupComponent,
    TransactionsComponent,
    StocksComponent,
    TradingComponent,
    StrategyComponent,
    RobinhoodComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ChartsModule,
    MatCardModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    CommonModule,
    MatTableModule,
    MatSelectModule
    
  ],
  providers: [UserBalanceService,StocksService,TransactionsService,{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
